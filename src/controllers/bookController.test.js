// test/unit/controllers/bookController.test.js
const { ObjectId } = require('mongodb');
const bookController = require('./bookController');
const bookSchema = require('../models/book');
const dbModule = require('../config/db-async');

// Mockowanie modułu połączenia z bazą danych
jest.mock('../config/db-async');

describe('Book Controller', () => {
    let mockClient;
    let req, res;

    beforeEach(() => {
        // Przygotowanie mockowanego klienta bazy danych
        mockClient = {
            db: jest.fn().mockReturnThis(),
            collection: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
            insertOne: jest.fn(),
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn()
        };

        // Mockowanie funkcji connectToDatabase
        dbModule.connectToDatabase.mockResolvedValue(mockClient);

        // Przygotowanie obiektów żądania i odpowiedzi
        req = {
            body: {},
            params: {},
            query: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        // Czyszczenie wszystkich mocków
        jest.clearAllMocks();
    });

    describe('createBook', () => {
        it('should call validateBook with request body data', async () => {
            // Szpiegowanie metody validateBook
            const validateBookSpy = jest.spyOn(bookSchema, 'validateBook');

            // Przygotowanie danych testowych
            mockClient.findOne.mockResolvedValue(null);
            mockClient.insertOne.mockResolvedValue({
                acknowledged: true,
                insertedId: new ObjectId('507f1f77bcf86cd799439011')
            });

            req.body = {
                isbn: '9876543210',
                name: 'Nowa Książka Testowa',
                price: 39.99
            };

            // Wywołanie testowanej metody
            await bookController.createBook(req, res);

            // Asercja
            expect(validateBookSpy).toHaveBeenCalledWith(req.body);
        });

        it('should return status code 400 when validation fails', async () => {
            // Przygotowanie nieprawidłowych danych
            req.body = {
                price: 39.99
                // Brak wymaganych pól
            };

            // Wywołanie testowanej metody
            await bookController.createBook(req, res);

            // Asercja
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return validation errors in response body when validation fails', async () => {
            // Przygotowanie nieprawidłowych danych
            req.body = {
                price: 39.99
                // Brak wymaganych pól
            };

            // Wywołanie testowanej metody
            await bookController.createBook(req, res);

            // Asercja
            expect(res.json).toHaveBeenCalled();
            const responseBody = res.json.mock.calls[0][0];
            expect(responseBody).toHaveProperty('errors');
            expect(Array.isArray(responseBody.errors)).toBe(true);
        });

        it('should insert valid book into database', async () => {
            // Przygotowanie danych
            mockClient.findOne.mockResolvedValue(null);
            mockClient.insertOne.mockResolvedValue({
                acknowledged: true,
                insertedId: new ObjectId('507f1f77bcf86cd799439011')
            });

            req.body = {
                isbn: '9876543210',
                name: 'Nowa Książka Testowa',
                price: 39.99
            };

            // Wywołanie testowanej metody
            await bookController.createBook(req, res);

            // Asercja
            expect(mockClient.insertOne).toHaveBeenCalled();
        });

        it('should return status code 201 when book is created successfully', async () => {
            // Przygotowanie danych
            mockClient.findOne.mockResolvedValue(null);
            mockClient.insertOne.mockResolvedValue({
                acknowledged: true,
                insertedId: new ObjectId('507f1f77bcf86cd799439011')
            });

            req.body = {
                isbn: '9876543210',
                name: 'Nowa Książka Testowa',
                price: 39.99
            };

            // Wywołanie testowanej metody
            await bookController.createBook(req, res);

            // Asercja
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should include insertedId in response when book is created successfully', async () => {
            // Przygotowanie danych
            const mockInsertedId = new ObjectId('507f1f77bcf86cd799439011');
            mockClient.findOne.mockResolvedValue(null);
            mockClient.insertOne.mockResolvedValue({
                acknowledged: true,
                insertedId: mockInsertedId
            });

            req.body = {
                isbn: '9876543210',
                name: 'Nowa Książka Testowa',
                price: 39.99
            };

            // Wywołanie testowanej metody
            await bookController.createBook(req, res);

            // Asercja
            expect(res.json).toHaveBeenCalled();
            const responseBody = res.json.mock.calls[0][0];
            expect(responseBody.insertedId).toEqual(mockInsertedId);
        });
    });

    describe('getBooksByName', () => {
        it('should query database with correct name parameter', async () => {
            // Konfiguracja
            const mockBooks = [];
            mockClient.toArray.mockResolvedValue(mockBooks);

            req.params.name = 'JavaScript i MongoDB';

            // Wywołanie testowanej metody
            await bookController.getBooksByName(req, res);

            // Asercja
            expect(mockClient.find).toHaveBeenCalledWith({"name": "JavaScript i MongoDB"});
        });

        it('should return status code 200 when books are retrieved successfully', async () => {
            // Konfiguracja
            const mockBooks = [];
            mockClient.toArray.mockResolvedValue(mockBooks);

            req.params.name = 'JavaScript i MongoDB';

            // Wywołanie testowanej metody
            await bookController.getBooksByName(req, res);

            // Asercja
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return array of books in response body', async () => {
            // Konfiguracja
            const mockBooks = [
                {
                    _id: new ObjectId('507f1f77bcf86cd799439011'),
                    isbn: '9876543210',
                    name: 'JavaScript i MongoDB',
                    price: 39.99
                }
            ];
            mockClient.toArray.mockResolvedValue(mockBooks);

            req.params.name = 'JavaScript i MongoDB';

            // Wywołanie testowanej metody
            await bookController.getBooksByName(req, res);

            // Asercja
            expect(res.json).toHaveBeenCalledWith(mockBooks);
        });
    });
});