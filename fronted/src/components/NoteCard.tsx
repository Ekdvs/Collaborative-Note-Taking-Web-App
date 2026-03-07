import React, { useState } from "react";
import toast from "react-hot-toast";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";
import EditNoteModal from "./EditNoteModal";
import CollaboratorModal from "./CollaboratorModal";

interface NoteCardProps {
  note: any;
  refresh: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, refresh }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);

  // Delete note
  const deleteNote = async () => {
    if (!confirm("Delete this note?")) return;

    try {
      const res = await Axios({
        method: SummaryApi.deleteNote.method,
        url: SummaryApi.deleteNote.url(note._id),
      });

      if (res.data.success) {
        toast.success("Note deleted");
        refresh();
      }
    } catch {
      toast.error("Failed to delete note");
    }
  };

  // Toggle pin and update backend
  const togglePin = async () => {
    try {
      const res = await Axios({
        method: SummaryApi.updateNote.method,
        url: SummaryApi.updateNote.url(note._id),
        data: { isPinned: !note.isPinned },
      });

      if (res.data.success) {
        toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
        refresh(); // refresh notes to reflect new pin state
      }
    } catch {
      toast.error("Failed to update pin");
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow hover:shadow-lg transition-shadow duration-200">
      {/* Title & Pin */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{note.title}</h3>
        <button
          onClick={togglePin}
          className="text-yellow-500 text-xl"
          title={note.isPinned ? "Unpin note" : "Pin note"}
        >
          {note.isPinned ? "📌" : "📍"}
        </button>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {note.tags.map((tag: string) => (
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
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={() => setEditOpen(true)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
        >
          Edit
        </button>

        <button
          onClick={() => setCollabOpen(true)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
        >
          Collaborators
        </button>

        <button
          onClick={deleteNote}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Modals */}
      {editOpen && (
        <EditNoteModal
          note={note}
          close={() => setEditOpen(false)}
          refresh={refresh}
        />
      )}

      {collabOpen && (
        <CollaboratorModal
          note={note}
          close={() => setCollabOpen(false)}
          refresh={refresh}
        />
      )}
    </div>
  );
};

export default NoteCard;