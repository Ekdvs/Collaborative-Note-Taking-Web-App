import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  note: any;
  close: () => void;
  refresh: () => void;
}

const EditNoteModal: React.FC<Props> = ({ note, close, refresh }) => {
  const [title, setTitle] = useState(note.title);
  const [tags, setTags] = useState<string[]>(note.tags || []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content || "",
  });

  // Update note
  const updateNote = async () => {
    try {
      const res = await Axios({
        method: SummaryApi.updateNote.method,
        url: SummaryApi.updateNote.url(note._id),
        data: {
          title,
          content: editor?.getHTML() || "",
          tags,
        },
      });

      if (res.data.success) {
        toast.success("Note updated");
        refresh();
        close();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  // Convert comma-separated input into tags array
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tagArray = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    setTags(tagArray);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Note</h2>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
          placeholder="Note Title"
        />

        {/* Tags */}
        <input
          type="text"
          value={tags.join(", ")}
          onChange={handleTagsChange}
          className="border w-full p-2 mb-4 rounded"
          placeholder="Add tags separated by comma"
        />

        {/* Content */}
        <div className="border rounded mb-4">
          {editor && <EditorContent editor={editor} />}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={updateNote}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>

          <button
            onClick={close}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;