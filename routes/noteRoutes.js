const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { validateCreateNote, validateUpdateNote } = require('../middleware/validateNote');

router.route('/')
  .get(getNotes)
  .post(validateCreateNote, createNote);

router.route('/:id')
  .get(getNoteById)
  .put(validateUpdateNote, updateNote)
  .delete(deleteNote);

module.exports = router;
