const fs = require('fs');
const path = require('path');

const booksFilePath = path.join(__dirname, 'data/books.json');



const readBooksFromFile = () => {
    try {
        if (!fs.existsSync(booksFilePath)) {
            fs.writeFileSync(booksFilePath, JSON.stringify([])); // Create file if not exists
        }
        const data = fs.readFileSync(booksFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading books file:', error);
        return [];
    }
};

const writeBooksToFile = (books) => {
    try {
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
    } catch (error) {
        console.error('Error writing books file:', error);
    }
};

const isUniqueISBN = (isbn) => {
    const books = readBooksFromFile(); // Read books from the file
    return !books.find(book => book.ISBN === isbn); // Return true if ISBN is unique
};

module.exports = {
    readBooksFromFile,
    writeBooksToFile,
    isUniqueISBN
};
