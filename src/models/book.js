const bookSchema = {
    validateBook: (book) => {
        const errors = [];

        if (!book.isbn) errors.push("ISBN jest wymagany");
        if (!book.name) errors.push("Nazwa książki jest wymagana");
        if (book.price && typeof book.price !== 'number') errors.push("Cena musi być liczbą");

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

module.exports = bookSchema;