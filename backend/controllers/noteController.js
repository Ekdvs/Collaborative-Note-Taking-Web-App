import { request, response } from "express";
import Note from "../models/note.js";
import User from "../models/user.js";



//create note
export const createNote = async (request,response)=>{
    try {
        const {title,content,tags} = request.body;
        if(!title){
            return response.status(400).json({
                message:'Title is required',
                error:true,
                success:false
            })
        }

        //create new note
        const newNote = new Note(
            {
                title,
                content,
                tags,
                owner:request.userId    
            }
        );

        await newNote.save();

        return response.status(201).json({
            message:'Note created successfully',
            error:false,
            success:true,
            data:newNote
        })
        
    } catch (error) {
        return response.status(500).json({
            message:'Internal server error',
            error:true,
            success:false
        })
    }
}

//get all notes (owner + collaborators)
export const getNotes = async(request,response)=>{
    try {
        const userId = request.userId;
        if(!userId){
            return response.status(401).json({
                message:'Unauthorized, user not found',
                error:true,
                success:false
            })
        }
        const notes = await Note.find(
            {
                isDeleted:false,
                $or:[
                    {owner:userId},
                    {collaborators:{$elemMatch:{user:userId}}}
                ]
            }
        ).sort(
            {
                isPinned:-1,
                updatedAt:-1
            }
        )

        if(notes.length===0){
            return response.status(200).json({
                message:'No notes found',
                error:false,
                success:true,
                data:[]
            })
        }

        return response.status(200).json({
            message:'Notes fetched successfully',
            error:false,
            success:true,
            data:notes
        })

    } catch (error) {
        return response.status(500).json({
            message:'Internal server error',
            error:true,
            success:false
        })
    }
}

//get single note by id (only owner and collaborators can access)
export const getNoteById = async (request,response)=>{
    try {
        const {id} = request.params;
        const userId = request.userId;

        if(!id){
            return response.status(400).json({
                message:'Note id is required',
                error:true,
                success:false
            })
        }

        if(!userId){
            return response.status(401).json({
                message:'Unauthorized, user not found',
                error:true,
                success:false
            })
        }

        //find note by id and check if user is owner or collaborator
        const note = await Note.findOne(
            {
                _id:id,
                isDeleted:false,
                $or:[
                    {owner:userId},
                    {collaborators:{$elemMatch:{user:userId}}}
                ]
            }
        );

    

        if(!note){
            return response.status(404).json({
                message:'Note not found',
                error:true,
                success:false
            })
        }
        return response.status(200).json({
            message:'Note fetched successfully',
            error:false,
            success:true,
            data:note
        })

        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal server error',
            error:true,
            success:false
        })
    }
}

//update note by id ( owner  can update)
export const updateNoteById = async(request,response)=>{
    try {
        const {id} = request.params;
        const {title,content,tags,isPinned} = request.body;
        const userId = request.userId;

        if(!id){
            return response.status(400).json({
                message:'Note id is required',
                error:true,
                success:false
            })
        }
        if(!userId){
            return response.status(401).json({
                message:'Unauthorized, user not found',
                error:true,
                success:false
            })
        }

        //find note by id and check if user is owner or editor
        const note = await Note.findById(id);

        if(!note || note.isDeleted){
            return response.status(404).json({
                message:'Note not found',
                error:true,
                success:false
            })
        }

        let role = "viewer";
        //console.log("owner id",note.owner.toString())
        //console.log("user id",userId.toString())
        if(note.owner.toString() === userId.toString()){
            role = "owner";
        }
        else{
            const collaborator = note.collaborators.find(
                (collab)=>collab.user.toString() === userId.toString()
            );
            if(collaborator){
                role = collaborator.role;
            }
        }
        if(role === "viewer"){
            return response.status(403).json({
                message:'Forbidden, you do not have permission to update this note',
                error:true,
                success:false
            })
        }

        //update note
        note.title = title??note.title;
        note.content = content??note.content;
        note.tags = tags??note.tags;
        note.isPinned = isPinned??note.isPinned;

        await note.save();
        return response.status(200).json({
            message:'Note updated successfully',
            error:false,
            success:true,
            data:note   
            })
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal server error',
            error:true,
            success:false
        })
    }
}

//delete note by id (only owner can delete)
export const deleteNoteById = async(request,response)=>{
    try {
        const {id} = request.params;
        const userId = request.userId;
        if(!id){
            return response.status(400).json({
                message:'Note id is required',
                error:true,
                success:false
            })
        }
        if(!userId){
            return response.status(401).json({
                message:'Unauthorized, user not found',
                error:true,
                success:false
            })
        }

        //find note by id and check if user is owner
        const note = await Note.findById(id);
        if(!note || note.isDeleted){
            return response.status(404).json({
                message:'Note not found',
                error:true,
                success:false
            })
        }

        if(note.owner.toString() !== userId.toString()){
            return response.status(403).json({
                message:'Forbidden, you do not have permission to delete this note',
                error:true,
                success:false
            })
        }
        
        note.isDeleted = true;
        await note.save();
        return response.status(200).json({
            message:'Note deleted successfully',
            error:false,
            success:true
        })

    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal server error',
            error:true,
            success:false
        })
    }
}

//full text search
export const searchNotes = async (request, response) => {
  try {
    const query = request.query.q?.trim();
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized, user not found",
        error: true,
        success: false,
      });
    }

    if (!query) {
      return response.status(400).json({
        message: "Search query cannot be empty",
        error: true,
        success: false,
      });
    }

    // Make sure the text index exists in your DB:
    // db.notes.createIndex({ title: "text", content: "text", tags: "text" })

    const notes = await Note.find({
  $and: [
    { $text: { $search: query } },
    { isDeleted: false },
    {
      $or: [
        { owner: userId },
        { collaborators: { $elemMatch: { user: userId } } },
      ],
    },
  ],
});

    return response.status(200).json({
      message: "Notes found successfully",
      error: false,
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("SearchNotes Error:", error);
    return response.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

//add collaborator to note (only owner can add)
export const  addCollaborator = async(request,response)=>{
    try {
        const {id} = request.params; //note id
        const userId = request.userId; //owner id
        const {email,role} = request.body; //collaborator email and role

        if(!id){
            return response.status(400).json({
                message:'Note id is required',
                error:true,
                success:false
            })
        }
        
        const note = await Note.findById(id);
        if(!note || note.isDeleted){
            return response.status(404).json({
                message:'Note not found',
                error:true,
                success:false
            })
        }

        if(note.owner.toString() !== userId.toString()){
            return response.status(403).json({
                message:'Forbidden, you do not have permission to add collaborator to this note',
                error:true,
                success:false
            })
        }
        //find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // check if already collaborator
        const collaborator = note.collaborators.find(
            c => c.user.toString() === user._id.toString()
        );

        if (collaborator) {
            return response.status(400).json({
                message: "User is already a collaborator",
                error: true,
                success: false
            });
        }

        note.collaborators.push(
            {
                user:user._id,
                role:role??"viewer"
            }
        );

        await note.save();
        return response.status(200).json({
            message:'Collaborator added successfully',
            error:false,
            success:true,
            data:note
        })
        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal server error',
            error:true,
            success:false
        })
    }
}

//remove collaborator from note (only owner can remove)
export const removeCollaborator =async(request,response)=>{
    try {
        const { id, userId } = request.params;
        const currentUserId = request.userId;

        if (!id) {
            return response.status(400).json({
                message: 'Note id is required',
                error: true,
                success: false
            });
        }
        
        //find note by id
        const note = await Note.findById(id);
        if (!note || note.isDeleted) {
            return response.status(404).json({
                message: 'Note not found',
                error: true,
                success: false
            });
        }

        if (note.owner.toString() !== currentUserId.toString()) {
            return response.status(403).json({
                message: 'Forbidden, you do not have permission to remove collaborator from this note',
                error: true,
                success: false
            });
        }

        //check collaborator exists
        const collaboratorExists = note.collaborators.some(
            (collab) => collab.user.toString() === userId
        );

        if (!collaboratorExists) {
            return response.status(404).json({
                message: 'Collaborator not found',
                error: true,
                success: false
            });
        }

        //remove collaborator
        note.collaborators = note.collaborators.filter(
            (collab) => collab.user.toString() !== userId
        );
        await note.save();

        return response.status(200).json({
            message: 'Collaborator removed successfully',
            error: false,
            success: true,
            data: note
        });
        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal server error',
            error:true,
            success:false
        })
    }
}