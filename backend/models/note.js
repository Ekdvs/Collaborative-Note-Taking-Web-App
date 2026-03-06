import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        enum:["owner","editor","viewer"],
        default:"viewer"
    }
},
{
    _id:false
}
);

const noteSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:[true,"Please provide a title for this note"],
        trim:true,
        maxlength:[100,"Title should be less than 100 characters"]
    },

    content:{
        type:String,
        default:""
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Please provide an owner for this note"],
        index:true
    },

    collaborators:{
        type:[collaboratorSchema],
        default:[]
    },

    tags:{
        type:[
        {
            type:String,
            trim:true,
            lowercase:true,
            maxlength:[30,"Tag should be less than 30 characters"]
        }
        ],
        default:[],
        validate:{
            validator:(arr)=>arr.length<=20,
            message:"A note can have a maximum of 20 tags"
        }
    },

    isPinned:{
        type:Boolean,
        default:false
    },

    isDeleted:{
        type:Boolean,
        default:false,
        index:true
    }

},
{
    timestamps:true
}
);

/* FULL TEXT SEARCH */
noteSchema.index({
title:"text",
content:"text",
tags:"text"
});

const Note = mongoose.model("Note",noteSchema);

export default Note;