// src/config/db-async.js
const { MongoClient } = require("mongodb");
const { ServerApiVersion } = require('mongodb');

let client = null;

async function connectToDatabase() {
    try {
        // Użyj zmiennej środowiskowej lub domyślnego URI
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/mongodb_books";

        // Opcje połączenia
        const options = {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        // Jeśli klient już istnieje, zwróć istniejący
        if (client) {
            console.log("Używam istniejącego połączenia z MongoDB");
            return client;
        }

        // Utwórz nowego klienta MongoDB
        client = new MongoClient(uri, options);

        // Połącz się z serwerem
        await client.connect();

        // Testuj połączenie za pomocą komendy ping
        await client.db("admin").command({ ping: 1 });
        console.log("Pomyślnie połączono z MongoDB! Baza danych jest dostępna.");

        return client;
    } catch (error) {
        console.error("Błąd podczas łączenia z MongoDB:", error);
        // Resetuj klienta w przypadku błędu, aby umożliwić ponowne próby
        client = null;
        throw error;
    }
}

module.exports = { connectToDatabase };
