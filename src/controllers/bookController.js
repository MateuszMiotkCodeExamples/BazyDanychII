// src/controllers/bookController.js
const { connectToDatabase } = require('../config/db-async');
const bookSchema = require('../models/book');

// Pobieranie wszystkich książek
exports.getAllBooks = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        const result = await books.find({}).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tworzenie nowej książki z walidacją
exports.createBook = async (req, res) => {
    try {
        // Walidacja danych wejściowych przy użyciu modelu
        const validation = bookSchema.validateBook(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                message: 'Nieprawidłowe dane książki',
                errors: validation.errors
            });
        }

        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Wstaw nowy dokument książki
        const book = {
            isbn: req.body.isbn,
            name: req.body.name,
            meta: req.body.meta || {},
            price: req.body.price,
            createdAt: new Date()
        };

        const insertResult = await books.insertOne(book);

        res.status(201).json({
            message: 'Książka została utworzona',
            insertedId: insertResult.insertedId,
            book
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pobieranie książek według nazwy
exports.getBooksByName = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Pobierz dokumenty z nazwą "JavaScript i MongoDB"
        const result = await books.find({"name": req.params.name || "JavaScript i MongoDB"}).toArray();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pobieranie książek według wersji (z zagnieżdżonym polem)
exports.getBooksByVersion = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        const query = {
            'meta.version': {
                "$regex": ".*?g.*?7\\.0$",
                "$options": "i"
            }
        };

        const result = await books.find(query).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pobieranie książek powyżej określonej ceny
exports.getBooksAbovePrice = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        const query = {
            'price': {
                "$gt": parseInt(req.params.price) || 50
            }
        };

        const result = await books.find(query).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pobieranie książek według nazwy i ceny (AND)
exports.getBooksByNameAndPrice = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        const query = {
            'name': req.query.name || 'Zaawansowane techniki MongoDB',
            'price': parseInt(req.query.price) || 70
        };

        const result = await books.find(query).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pobieranie książek według warunku OR
exports.getBooksWithOrCondition = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        const query = {
            "$or": [
                {'name': req.query.name || 'Zaawansowane techniki MongoDB'},
                {'isbn': req.query.isbn || '301'}
            ]
        };

        const result = await books.find(query).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aktualizacja książki z walidacją
exports.updateBook = async (req, res) => {
    try {
        // Tworzymy obiekt z istniejącym ISBN i nowymi danymi
        const bookToValidate = {...req.body, isbn: req.params.isbn};

        // Walidacja danych aktualizacji
        const validation = bookSchema.validateBook(bookToValidate);
        if (!validation.isValid) {
            return res.status(400).json({
                message: 'Nieprawidłowe dane aktualizacji',
                errors: validation.errors
            });
        }

        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Przygotowanie danych do aktualizacji
        const updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.meta) updateData.meta = req.body.meta;
        if (req.body.price !== undefined) updateData.price = req.body.price;
        updateData.updatedAt = new Date();

        const updateResult = await books.updateOne(
            {"isbn": req.params.isbn},
            {"$set": updateData}
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: 'Nie znaleziono książki o podanym ISBN' });
        }

        // Pobierz zaktualizowany dokument
        const updatedDocument = await books.findOne({"isbn": req.params.isbn});

        res.status(200).json({
            result: updateResult,
            updatedDocument
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Usuwanie książki
exports.deleteBook = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        const deleteResult = await books.deleteOne({"isbn": req.params.isbn});

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'Nie znaleziono książki o podanym ISBN' });
        }

        res.status(200).json({
            message: 'Książka została usunięta',
            result: deleteResult
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};