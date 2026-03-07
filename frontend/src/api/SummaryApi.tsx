
export const baseUrl = "http://localhost:8080" //import.meta.env.BASE_URL || "http://localhost:8080";


const SummaryApi = {

    //register
    register:{
        url:"/api/users/register",
        method:"POST"
    },
    login:{
        url:"/api/users/login",
        method:"POST"
    },
    getUser:{
      url:"/api/users/me",
      method:"GET"

    },
    logout:{
      url:"/api/users/logout",
      method:"POST"
    },
    createNote: {
    url: "/api/notes/create",
    method: "POST"
  },

  getNotes: {
    url: "/api/notes",
    method: "GET"
  },

  updateNote: {
    url: (id: string) => `/api/notes/update/${id}`,
    method: "PUT"
  },

  deleteNote: {
    url: (id: string) => `/api/notes/delete/${id}`,
    method: "DELETE"
  },

  searchNotes: {
    url: "/api/notes/search",
    method: "GET"
  },

  addCollaborator: {
    url: (id: string) => `/api/notes/${id}/collaborators`,
    method: "POST"
  },

  removeCollaborator: {
    url: (noteId: string, userId: string) =>
      `/api/notes/${noteId}/collaborators/${userId}`,
    method: "DELETE"
  }

}

export default SummaryApi;