// src/config/db.js
const { MongoClient } = require("mongodb");
// Zastąp placeholder swoim ciągiem połączenia
const uri = "mongodb://localhost:27017";
// Utwórz nowego klienta i połącz się z serwerem
const client = new MongoClient(uri);
// Wyślij ping, aby potwierdzić udane połączenie
async function ping() {
    try {
        await client.admin.command('ping');
        console.log("Wysłano ping do twojego wdrożenia. Pomyślnie połączono z MongoDB!");
    } catch (e) {
        console.error(e);
    }
}
ping();