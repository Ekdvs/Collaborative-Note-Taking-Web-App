import React, { useState } from "react";
import toast from "react-hot-toast";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";

const CreateNote = () => {

  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");

  const createNote = async () => {

    if(!title){
      toast.error("Title required");
      return;
    }

    try{

      const res = await Axios({
        method: SummaryApi.createNote.method,
        url: SummaryApi.createNote.url,
        data:{title,content}
      });

      if(res.data.success){
        toast.success("Note created");
        setTitle("");
        setContent("");
        window.location.reload();
      }

    }catch(err){
      toast.error("Failed to create note");
    }

  };

  return (

    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Create Note
      </h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        className="w-full border p-3 mb-4 rounded"
      />

      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e)=>setContent(e.target.value)}
        className="w-full border p-3 mb-4 rounded h-32"
      />

      <button
        onClick={createNote}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Create Note
      </button>

    </div>
  );
};

export default CreateNote;