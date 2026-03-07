import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";

interface SearchBarProps {
  setNotes: React.Dispatch<React.SetStateAction<any[]>>;
  fetchNotes: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setNotes, fetchNotes }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false); // optional: show loading state

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        fetchNotes();
        return;
      }
      searchNotes();
    }, 400); // 400ms debounce

    return () => clearTimeout(delay);
  }, [query]);

  const searchNotes = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        method: SummaryApi.searchNotes.method,
        url: `${SummaryApi.searchNotes.url}?q=${query}`,
      });

      if (res.data.success) {
        setNotes(res.data.data);
      } else {
        // If search fails or no data
        setNotes([]);
        console.warn("Search warning:", res.data.message);
      }
    } catch (error: any) {
      // Handle Axios/network errors
      console.error("Search failed:", error.response?.data || error.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border pl-10 pr-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && (
        <span className="absolute right-3 top-3 text-gray-400 text-sm animate-pulse">
          Searching...
        </span>
      )}
    </div>
  );
};

export default SearchBar;