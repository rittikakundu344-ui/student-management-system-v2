export default{
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": [
    "<rootDir>/__tests__/setup.js"
  ],
  "moduleNameMapper": {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  "transform": {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  "testMatch": [
    "**/__tests__/**/*.test.js",
    "**/__tests__/**/*.test.jsx"
  ]
}
