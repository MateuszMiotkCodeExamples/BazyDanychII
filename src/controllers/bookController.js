// src/controllers/bookController.js
const { connectToDatabase } = require('../config/db-async');

exports.createBook = async (req, res) => {
    try {
        const client = await connectToDatabase();
        // Użyj bazy danych 'mongodb_books' i kolekcji 'books'
        const books = client.db('mongodb_books').collection('books');

        // Wstaw nowy dokument książki
        const book = {
            'isbn': '301',
            'name': 'JavaScript i MongoDB',
            'meta': {'version': 'MongoDB 7.0'},
            'price': 60
        };

        const insertResult = await books.insertOne(book);
        console.log(insertResult);

        res.status(201).json({
            message: 'Książka została utworzona',
            insertedId: insertResult.insertedId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getBooksByName = async (req, res) => {
    try {
        const client = await connectToDatabase();
        // Użyj bazy danych 'mongodb_books' i kolekcji 'books'
        const books = client.db('mongodb_books').collection('books');

        // Pobierz dokumenty z nazwą "JavaScript i MongoDB"
        const result = await books.find({"name": "JavaScript i MongoDB"}).toArray();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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

        // Pobierz dokumenty pasujące do zapytania
        const result = await books.find(query).toArray();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getBooksAbovePrice = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Zdefiniuj zapytanie używające operatora porównania $gt
        const query = {
            'price': {
                "$gt": 50
            }
        };

        // Pobierz dokumenty pasujące do zapytania
        const result = await books.find(query).toArray();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getBooksByNameAndPrice = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Zdefiniuj zapytanie z warunkami logicznymi AND
        const query = {
            'name': 'Zaawansowane techniki MongoDB',
            'price': 70
        };

        // Pobierz dokumenty pasujące do zapytania
        const result = await books.find(query).toArray();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getBooksWithOrCondition = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Zdefiniuj zapytanie z warunkami $or
        const query = {
            "$or": [
                {'name': 'Zaawansowane techniki MongoDB'},
                {'isbn': '301'}
            ]
        };

        // Pobierz dokumenty pasujące do zapytania
        const result = await books.find(query).toArray();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateBook = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Zaktualizuj cenę książki o nazwie "Zaawansowane techniki MongoDB"
        const updateResult = await books.updateOne(
            {"name": "Zaawansowane techniki MongoDB"},
            {"$set": {"price": 75}}  // Ustawienie nowej ceny na 75
        );

        // Wypisz wynik operacji aktualizacji
        console.log(updateResult);

        // Pobierz zaktualizowany dokument, aby zweryfikować zmianę
        const updatedDocument = await books.findOne({"name": "Zaawansowane techniki MongoDB"});

        res.status(200).json({
            result: updateResult,
            updatedDocument: updatedDocument
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const client = await connectToDatabase();
        const books = client.db('mongodb_books').collection('books');

        // Numer ISBN książki do usunięcia
        const isbnToDelete = '303';

        // Usuń książkę o określonym numerze ISBN
        const deleteResult = await books.deleteOne({"isbn": isbnToDelete});

        // Wypisz wynik operacji usuwania
        console.log(deleteResult);

        res.status(200).json({
            message: 'Książka została usunięta',
            result: deleteResult
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

