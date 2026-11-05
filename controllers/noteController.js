const Note = require('../models/Note');

// @desc    Get all notes (Supports Pagination, Sorting, Search, Category Filter)
// @route   GET /api/notes
exports.getNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort, search, q, category } = req.query;

    // 1. Build Query Object
    let query = {};

    // Search filter (accepts both 'q' or 'search' parameter)
    const keyword = search || q;
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Category filter
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // 2. Sorting Logic (Default: newest first)
    let sortOptions = { createdAt: -1 };
    if (sort) {
      const field = sort.startsWith('-') ? sort.substring(1) : sort;
      const allowedFields = ['createdAt', 'updatedAt', 'title', 'category'];
      if (!allowedFields.includes(field)) {
        const error = new Error(`Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`);
        error.statusCode = 400;
        throw error;
      }
      const order = sort.startsWith('-') ? -1 : 1;
      sortOptions = { [field]: order };
    }

    // 3. Pagination Logic
    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (!Number.isInteger(pageNum) || pageNum < 1 || !Number.isInteger(limitNum) || limitNum < 1) {
      const error = new Error('page and limit must be positive integers');
      error.statusCode = 400;
      throw error;
    }
    const skip = (pageNum - 1) * limitNum;

    const totalNotes = await Note.countDocuments(query);
    const notes = await Note.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: notes.length,
      pagination: {
        totalItems: totalNotes,
        currentPage: pageNum,
        totalPages: Math.ceil(totalNotes / limitNum),
        limit: limitNum
      },
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new note
// @route   POST /api/notes
exports.createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
