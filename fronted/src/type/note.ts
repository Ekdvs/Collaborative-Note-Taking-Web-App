// note.ts
export interface Collaborator {
  user: string;
  role: "owner" | "editor" | "viewer";
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  owner: string;
  collaborators: Collaborator[];
}