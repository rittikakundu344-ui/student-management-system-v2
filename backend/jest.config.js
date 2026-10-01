export default{
  "testEnvironment": "node",
  "collectCoverageFrom": [
    "**/*.js",
    "!node_modules/**",
    "!tests/**"
  ],
  "testMatch": [
    "**/tests/**/*.test.js"
  ],
  "setupFiles": [
    "<rootDir>/tests/setup.js"
  ],
  "verbose": true
}
