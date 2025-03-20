// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/src/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js'
    ],
    // Ustawienie timeoutu na 10 sekund (wartość w milisekundach)
    testTimeout: 10000
};