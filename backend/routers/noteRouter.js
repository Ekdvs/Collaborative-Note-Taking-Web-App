import express from 'express';
import auth from '../middleweare/auth.js';
import { createNote, getNoteById, getNotes, updateNoteById } from '../controllers/noteController.js';

const noteRouter = express.Router();

noteRouter.post('/create',auth,createNote)
noteRouter.get('/',auth,getNotes)
noteRouter.get('/getNoteById/:id',auth,getNoteById)
noteRouter.put('/update/:id',auth,updateNoteById)

export default noteRouter