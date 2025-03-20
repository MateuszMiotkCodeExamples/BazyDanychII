// test/unit/models/book.test.js
const bookSchema = require('./book');

describe('Book Model', () => {
    describe('validateBook', () => {
        it('should return isValid as true for a valid book', () => {
            const validBook = {
                isbn: '1234567890',
                name: 'Test Book',
                price: 29.99
            };

            const result = bookSchema.validateBook(validBook);
            expect(result.isValid).toBe(true);
        });

        it('should return empty errors array for a valid book', () => {
            const validBook = {
                isbn: '1234567890',
                name: 'Test Book',
                price: 29.99
            };

            const result = bookSchema.validateBook(validBook);
            expect(result.errors).toEqual([]);
        });

        it('should return isValid as false when ISBN is missing', () => {
            const invalidBook = {
                name: 'Test Book',
                price: 29.99
            };

            const result = bookSchema.validateBook(invalidBook);
            expect(result.isValid).toBe(false);
        });

        it('should include correct error message when ISBN is missing', () => {
            const invalidBook = {
                name: 'Test Book',
                price: 29.99
            };

            const result = bookSchema.validateBook(invalidBook);
            expect(result.errors).toContain('ISBN jest wymagany');
        });

        it('should return isValid as false when name is missing', () => {
            const invalidBook = {
                isbn: '1234567890',
                price: 29.99
            };

            const result = bookSchema.validateBook(invalidBook);
            expect(result.isValid).toBe(false);
        });

        it('should include correct error message when name is missing', () => {
            const invalidBook = {
                isbn: '1234567890',
                price: 29.99
            };

            const result = bookSchema.validateBook(invalidBook);
            expect(result.errors).toContain('Nazwa książki jest wymagana');
        });

        it('should return isValid as false when price is not a number', () => {
            const invalidBook = {
                isbn: '1234567890',
                name: 'Test Book',
                price: 'invalid'
            };

            const result = bookSchema.validateBook(invalidBook);
            expect(result.isValid).toBe(false);
        });

        it('should include correct error message when price is not a number', () => {
            const invalidBook = {
                isbn: '1234567890',
                name: 'Test Book',
                price: 'invalid'
            };

            const result = bookSchema.validateBook(invalidBook);
            expect(result.errors).toContain('Cena musi być liczbą');
        });
    });
});