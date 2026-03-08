
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";
import EditNoteModal from "./EditNoteModal";
import CollaboratorModal from "./CollaboratorModal";

interface NoteCardProps {
  note: any;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);
  const [noteData, setNoteData] = useState(note);

  // Delete note
  const deleteNote = async () => {
    if (!confirm("Delete this note?")) return;

    try {
      const res = await Axios({
        method: SummaryApi.deleteNote.method,
        url: SummaryApi.deleteNote.url(noteData._id),
      });

      if (res.data.success) {
        toast.success("Note deleted");
      }
    } catch {
      toast.error("Failed to delete note");
    }
  };

  // Toggle pin
  const togglePin = async () => {
    try {
      const res = await Axios({
        method: SummaryApi.updateNote.method,
        url: SummaryApi.updateNote.url(noteData._id),
        data: { isPinned: !noteData.isPinned },
      });

      if (res.data.success) {
        const updated = { ...noteData, isPinned: !noteData.isPinned };
        setNoteData(updated);

        toast.success(updated.isPinned ? "Note pinned" : "Note unpinned");
      }
    } catch {
      toast.error("Failed to update pin");
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow hover:shadow-lg transition-shadow duration-200">

      {/* Title + Pin */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{noteData.title}</h3>

        <button
          onClick={togglePin}
          className="text-yellow-500 text-xl"
          title={noteData.isPinned ? "Unpin note" : "Pin note"}
        >
          {noteData.isPinned ? "📌" : "📍"}
        </button>
      </div>

      {/* Tags */}
      {noteData.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {noteData.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className="text-gray-600 mt-3 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: noteData.content }}
      />

      {/* Buttons */}
      <div className="flex gap-2 mt-4 flex-wrap">

        <button
          onClick={() => setEditOpen(true)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>

        <button
          onClick={() => setCollabOpen(true)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Collaborators
        </button>

        <button
          onClick={deleteNote}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>

      </div>

      {/* Modals */}

      {editOpen && (
        <EditNoteModal
          note={noteData}
          close={() => setEditOpen(false)}
        />
      )}

      {collabOpen && (
        <CollaboratorModal
          note={noteData}
          close={() => setCollabOpen(false)}
        />
      )}

    </div>
  );
};

export default NoteCard;

