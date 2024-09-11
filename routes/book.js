const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const basicAuth = require('../middlewares/authmiddleware');

// Public routes
router.get('/search', bookController.searchBooks); // Move this above the dynamic /:id route
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', basicAuth, bookController.createBook);
router.put('/:id', basicAuth, bookController.updateBook);
router.delete('/:id', basicAuth, bookController.deleteBook);

module.exports = router;
