import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";

interface SearchBarProps {
  setNotes: React.Dispatch<React.SetStateAction<any[]>>;
  fetchNotes: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setNotes, fetchNotes }) => {

  const [query,setQuery] = useState("");

  useEffect(()=>{

    const delay = setTimeout(()=>{

      if(!query.trim()){
        fetchNotes();
        return;
      }

      searchNotes();

    },400);

    return ()=>clearTimeout(delay);

  },[query]);

  const searchNotes = async()=>{

    const res = await Axios({
      method: SummaryApi.searchNotes.method,
      url:`${SummaryApi.searchNotes.url}?q=${query}`
    });

    if(res.data.success){
      setNotes(res.data.data);
    }

  };

  return (

    <div className="relative mb-6">

      <Search className="absolute left-3 top-3 text-gray-400"/>

      <input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        className="border pl-10 pr-3 py-2 w-full rounded"
      />

    </div>

  );
};

export default SearchBar;