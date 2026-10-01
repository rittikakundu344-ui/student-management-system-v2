import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Connect to test database
beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_knowledge_management_test';
  await mongoose.connect(testDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Disconnect after tests
afterAll(async () => {
  await mongoose.disconnect();
});

// Increase test timeout
jest.setTimeout(30000);
