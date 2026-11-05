const Joi = require('joi');

const createNoteSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),
  content: Joi.string().trim().min(5).required(),
  category: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional()
});

const updateNoteSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).optional(),
  content: Joi.string().trim().min(5).optional(),
  category: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional()
}).min(1);

const validateNote = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/"/g, '')
    });
  }
  next();
};

const validateCreateNote = validateNote(createNoteSchema);
const validateUpdateNote = validateNote(updateNoteSchema);

module.exports = { validateCreateNote, validateUpdateNote };
