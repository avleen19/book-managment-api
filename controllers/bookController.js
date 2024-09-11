const { readBooksFromFile, writeBooksToFile, isUniqueISBN } = require('../models/bookModel');

let nextId = 1; 

// Create a new book
exports.createBook = (req, res) => {
    const { title, author, genre, publicationYear, imageUrl, ISBN, description } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required.' });
    }
    if (ISBN && !isUniqueISBN(ISBN)) {
        return res.status(400).json({ error: 'ISBN must be unique.' });
    }

    const books = readBooksFromFile(); // Read from file
    const newBook = {
        id: nextId++, // Update ID management properly in a real application
        title,
        author,
        genre: genre || 'Unknown',
        publicationYear: publicationYear || 'Unknown',
        imageUrl: imageUrl || 'https://via.placeholder.com/150',
        ISBN: ISBN || '',
        description: description || '',
    };

    books.push(newBook);
    writeBooksToFile(books); // Write to file

    return res.status(201).json(newBook);
};


exports.getAllBooks = (req, res) => {
    const { genre, author, publicationYear, page = 1, limit = 10 } = req.query;

    const books = readBooksFromFile(); // Read from file

    let filteredBooks = books;

    if (genre) filteredBooks = filteredBooks.filter(book => book.genre === genre);
    if (author) filteredBooks = filteredBooks.filter(book => book.author === author);
    if (publicationYear) filteredBooks = filteredBooks.filter(book => book.publicationYear == publicationYear);

    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedBooks = filteredBooks.slice(start, end);

    return res.json({
        total: filteredBooks.length,
        currentPage: page,
        totalPages: Math.ceil(filteredBooks.length / limit),
        books: paginatedBooks,
    });
};


exports.getBookById = (req, res) => {
    const books = readBooksFromFile(); // Read from file
    const bookId = parseInt(req.params.id); // Parse ID from URL parameter

    if (isNaN(bookId)) {
        return res.status(400).json({ error: 'Invalid ID format.' });
    }

    const book = books.find(b => b.id === bookId); // Find book by ID

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    return res.json(book); // Return the book
};


exports.updateBook = (req, res) => {
    const books = readBooksFromFile(); // Read from file
    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    const { title, author, genre, publicationYear, imageUrl, ISBN, description } = req.body;

    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (publicationYear) book.publicationYear = publicationYear;
    if (imageUrl) book.imageUrl = imageUrl;
    if (description) book.description = description;

    writeBooksToFile(books); // Write to file

    return res.json(book);
};

// Delete a book by ID
exports.deleteBook = (req, res) => {
    const books = readBooksFromFile(); // Read from file
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    books.splice(bookIndex, 1);
    writeBooksToFile(books); // Write to file

    return res.status(204).send();
};

exports.searchBooks = (req, res) => {
    const { title, author, ISBN } = req.query;
    const books = readBooksFromFile(); // Ensure this reads the correct data

    let results = books;

    if (title && title.trim() !== '') {
        results = results.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (author && author.trim() !== '') {
        results = results.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    }
    if (ISBN && ISBN.trim() !== '') {
        results = results.filter(book => book.ISBN.includes(ISBN));
    }

    if (results.length === 0) {
        return res.status(404).json({ error: 'No books found.' });
    }

    return res.json(results);
};


