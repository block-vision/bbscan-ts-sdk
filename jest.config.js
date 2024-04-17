/** @type {import('jest').Config} */
const config = {
	coverageProvider: 'v8',
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
	testPathIgnorePatterns: ['/node_modules/'],
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	testTimeout: 60 * 1000,
	setupFiles: ['<rootDir>/test/setup.ts']
}

module.exports = config
