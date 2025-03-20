// test/integration/routes/bookRoutes.test.js
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

// Zmienne globalne
let app;
let mongoServer;
let mongoClient;
let booksCollection;

describe('Book API Routes', () => {
    // Konfiguracja przed wszystkimi testami
    beforeAll(async () => {
        // Uruchom MongoDB w pamięci
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Podmieniamy URI w konfiguracji aplikacji
        process.env.MONGO_URI = mongoUri;

        // Importujemy aplikację po ustawieniu zmiennych środowiskowych
        app = require('../app');

        // Połącz się bezpośrednio z bazą danych w pamięci
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        booksCollection = mongoClient.db('mongodb_books').collection('books');
    });

    // Sprzątanie po wszystkich testach
    afterAll(async () => {
        if (mongoClient) await mongoClient.close();
        if (mongoServer) await mongoServer.stop();
    });

    // Czyszczenie kolekcji przed każdym testem
    beforeEach(async () => {
        await booksCollection.deleteMany({});
    });

    describe('POST /api/books', () => {
        it('should return status code 201 when creating valid book', async () => {
            const newBook = {
                isbn: '1234567890',
                name: 'Test Integration Book',
                price: 29.99
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook);

            expect(response.status).toBe(201);
        });

        it('should return success message in response body', async () => {
            const newBook = {
                isbn: '1234567890',
                name: 'Test Integration Book',
                price: 29.99
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook);

            expect(response.body.message).toBe('Książka została utworzona');
        });

        it('should return insertedId in response body', async () => {
            const newBook = {
                isbn: '1234567890',
                name: 'Test Integration Book',
                price: 29.99
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook);

            expect(response.body).toHaveProperty('insertedId');
        });

        it('should save book to database with correct ISBN', async () => {
            const newBook = {
                isbn: '1234567890',
                name: 'Test Integration Book',
                price: 29.99
            };

            await request(app)
                .post('/api/books')
                .send(newBook);

            const savedBook = await booksCollection.findOne({ isbn: '1234567890' });
            expect(savedBook.isbn).toBe('1234567890');
        });

        it('should save book to database with correct name', async () => {
            const newBook = {
                isbn: '1234567890',
                name: 'Test Integration Book',
                price: 29.99
            };

            await request(app)
                .post('/api/books')
                .send(newBook);

            const savedBook = await booksCollection.findOne({ isbn: '1234567890' });
            expect(savedBook.name).toBe('Test Integration Book');
        });

        it('should return status code 400 when ISBN is missing', async () => {
            const invalidBook = {
                name: 'Test Integration Book',
                price: 29.99
            };

            const response = await request(app)
                .post('/api/books')
                .send(invalidBook);

            expect(response.status).toBe(400);
        });

        it('should return validation errors when data is invalid', async () => {
            const invalidBook = {
                name: 'Test Integration Book',
                price: 29.99
            };

            const response = await request(app)
                .post('/api/books')
                .send(invalidBook);

            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
        });
    });

    describe('GET /api/books', () => {
        beforeEach(async () => {
            // Wstaw kilka testowych książek przed każdym testem tego bloku
            await booksCollection.insertMany([
                { isbn: '111', name: 'Book 1', price: 10 },
                { isbn: '222', name: 'Book 2', price: 20 },
                { isbn: '333', name: 'Book 3', price: 30 }
            ]);
        });

        it('should return status code 200', async () => {
            const response = await request(app).get('/api/books');
            expect(response.status).toBe(200);
        });

        it('should return all books in database', async () => {
            const response = await request(app).get('/api/books');
            expect(response.body.length).toBe(3);
        });

        it('should include ISBN 111 in returned books', async () => {
            const response = await request(app).get('/api/books');
            const isbns = response.body.map(book => book.isbn);
            expect(isbns).toContain('111');
        });

        it('should include ISBN 222 in returned books', async () => {
            const response = await request(app).get('/api/books');
            const isbns = response.body.map(book => book.isbn);
            expect(isbns).toContain('222');
        });

        it('should include ISBN 333 in returned books', async () => {
            const response = await request(app).get('/api/books');
            const isbns = response.body.map(book => book.isbn);
            expect(isbns).toContain('333');
        });
    });
});