const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/book');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
