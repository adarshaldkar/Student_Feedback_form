import { Client, Account, Databases, Query } from 'appwrite';

// Appwrite configuration
const client = new Client();

client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID');

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// Database and collection IDs
export const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID || 'students-feedback-db';
export const COLLECTIONS = {
  USERS: 'users',
  FEEDBACK_FORMS: 'feedback_forms',
  STUDENT_FEEDBACK: 'student_feedback'
};

// Export Query for database queries
export { Query };

// Export client for additional services if needed
export { client };

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

export default {
  client,
  account,
  databases,
  DATABASE_ID,
  COLLECTIONS,
  Query,
  isAuthenticated,
  getCurrentUser
};