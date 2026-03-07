import React, { useEffect, useState } from "react";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";
import NoteCard from "./NoteCard";
import SearchBar from "./SearchBar";

const NotesList = () => {

  const [notes,setNotes] = useState<any[]>([]);

  const fetchNotes = async () => {

    const res = await Axios({
      method: SummaryApi.getNotes.method,
      url: SummaryApi.getNotes.url
    });

    if(res.data.success){
      setNotes(res.data.data);
    }

  };

  useEffect(()=>{
    fetchNotes();
  },[]);

  return (
    <div>

      <SearchBar setNotes={setNotes} fetchNotes={fetchNotes}/>

      <div className="grid grid-cols-3 gap-6">

        {notes.map((note)=>(
          <NoteCard
            key={note._id}
            note={note}
            refresh={fetchNotes}
          />
        ))}

      </div>

    </div>
  );
};

export default NotesList;