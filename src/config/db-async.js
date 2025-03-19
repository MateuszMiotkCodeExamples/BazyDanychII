// src/config/db-async.js
const { MongoClient } = require("mongodb");
const { ServerApiVersion } = require('mongodb');

async function connectToDatabase() {
    // Zastąp placeholder swoim ciągiem połączenia Atlas
    const uri = "<connection string>";
    // Ustaw wersję Stable API podczas tworzenia nowego klienta
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

    // Wyślij ping, aby potwierdzić udane połączenie
    try {
        await client.admin.command('ping');
        console.log("Wysłano ping do twojego wdrożenia. Pomyślnie połączono z MongoDB!");
        return client;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports = { connectToDatabase };
