import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Connect to test database
beforeAll(async () => {
  const testDbUri = process.env['MONGODB_TEST_URI'] || 'mongodb://admin:password123@localhost:27018/codeskins-test?authSource=admin';
  await mongoose.connect(testDbUri);
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}); 