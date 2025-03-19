// src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Pobierz wszystkie książki
router.get('/', bookController.getAllBooks);

// Pobierz książki według nazwy
router.get('/name/:name', bookController.getBooksByName);

// Pobierz książki według wersji
router.get('/version', bookController.getBooksByVersion);

// Pobierz książki z ceną powyżej określonej wartości
router.get('/price-above/:price', bookController.getBooksAbovePrice);

// Pobierz książki według nazwy i ceny
router.get('/filter', bookController.getBooksByNameAndPrice);

// Pobierz książki z warunkiem OR
router.get('/or-condition', bookController.getBooksWithOrCondition);

// Utwórz nową książkę
router.post('/', bookController.createBook);

// Zaktualizuj książkę
router.put('/:isbn', bookController.updateBook);

// Usuń książkę
router.delete('/:isbn', bookController.deleteBook);

module.exports = router;