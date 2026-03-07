import React from "react";
import CreateNote from "../components/CreateNote";
import NotesList from "../components/NotesList";

const NotesPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Collaborative Notes
      </h1>

      <CreateNote />

      <div className="mt-10">
        <NotesList />
      </div>

    </div>
  );
};

export default NotesPage;