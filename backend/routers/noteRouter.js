import express from 'express';
import auth from '../middleweare/auth.js';
import { addCollaborator, createNote, deleteNoteById, getNoteById, getNotes, removeCollaborator, searchNotes, updateNoteById } from '../controllers/noteController.js';

const noteRouter = express.Router();

noteRouter.post('/create',auth,createNote)
noteRouter.get('/',auth,getNotes)
noteRouter.get('/getNoteById/:id',auth,getNoteById)
noteRouter.put('/update/:id',auth,updateNoteById)
noteRouter.delete('/delete/:id',auth,deleteNoteById)
noteRouter.get('/search',auth,searchNotes)
noteRouter.post('/:id/collaborators',auth,addCollaborator)
noteRouter.delete('/:id/collaborators/:userId',auth,removeCollaborator)

export default noteRouter