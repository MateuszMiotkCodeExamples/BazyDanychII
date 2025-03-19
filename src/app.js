// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');

// Inicjalizacja aplikacji Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Połączenie z bazą danych
connectToDatabase()
    .then(client => {
        console.log('Połączono z MongoDB pomyślnie');
        global.mongoClient = client; // Opcjonalnie: przechowaj klienta globalnie
    })
    .catch(err => {
        console.error('Błąd podczas łączenia z MongoDB:', err);
        process.exit(1);
    });

// Rejestracja tras API
app.use('/api/books', bookRoutes);

// Podstawowa trasa
app.get('/', (req, res) => {
    res.json({ message: 'Witaj w API MongoDB Books' });
});

// Obsługa błędów
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Wystąpił błąd serwera', error: err.message });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

// Obsługa zamknięcia aplikacji
process.on('SIGINT', async () => {
    if (global.mongoClient) {
        await global.mongoClient.close();
        console.log('Połączenie z MongoDB zostało zamknięte');
    }
    process.exit(0);
});

module.exports = app;
