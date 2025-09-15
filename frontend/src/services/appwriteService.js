import { ID, Permission, Role } from 'appwrite';
import { account, databases, DATABASE_ID, COLLECTIONS, Query } from '../lib/appwrite';

class AppwriteService {
  
  // ========== AUTHENTICATION SERVICES ==========
  
  // Register new user (admin)
  async register(email, password, name, username, role = 'admin') {
    try {
      // Create account
      const user = await account.create(ID.unique(), email, password, name);
      
      // Create user document in database
      await this.createUserDocument(user.$id, username, email, role);
      
      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
  
  // Login user
  async login(email, password) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  // Logout user
  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
  
  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
  
  // ========== USER DOCUMENT SERVICES ==========
  
  // Create user document in database
  async createUserDocument(userId, username, email, role) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        {
          userId,
          username,
          email,
          role,
          createdAt: new Date().toISOString()
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId))
        ]
      );
    } catch (error) {
      console.error('Create user document error:', error);
      throw error;
    }
  }
  
  // Get user document by userId
  async getUserDocument(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );
      return response.documents[0] || null;
    } catch (error) {
      console.error('Get user document error:', error);
      return null;
    }
  }
  
  // ========== FEEDBACK FORMS SERVICES ==========
  
  // Create feedback form
  async createFeedbackForm(formData, createdBy) {
    try {
      const formId = ID.unique();
      const shareableLink = `${window.location.origin}/#/student/${formId}`;
      
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FEEDBACK_FORMS,
        formId,
        {
          ...formData,
          createdBy,
          shareableLink,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        [
          Permission.read(Role.any()),  // Anyone can read (for students)\n          Permission.update(Role.user(createdBy)),
          Permission.delete(Role.user(createdBy))        ]
      );
      
      return document;
    } catch (error) {
      console.error('Create feedback form error:', error);
      throw error;
    }
  }
  
  // Get all feedback forms for admin
  async getFeedbackForms(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FEEDBACK_FORMS,
        [
          Query.equal('createdBy', userId),
          Query.equal('isActive', true)
        ]
      );
      
      // Get response counts for each form
      const formsWithCounts = await Promise.all(
        response.documents.map(async (form) => {
          const feedbackCount = await this.getFeedbackCount(form.$id);
          return {
            ...form,
            response_count: feedbackCount
          };
        })
      );
      
      return formsWithCounts;
    } catch (error) {
      console.error('Get feedback forms error:', error);
      throw error;
    }
  }
  
  // Get single feedback form by ID (for students)
  async getFeedbackForm(formId) {
    try {
      const form = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.FEEDBACK_FORMS,
        formId
      );
      
      if (!form.isActive) {
        throw new Error('Feedback form not found');
      }
      
      return form;
    } catch (error) {
      console.error('Get feedback form error:', error);
      throw error;
    }
  }
  
  // Update feedback form
  async updateFeedbackForm(formId, updateData, userId) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.FEEDBACK_FORMS,
        formId,
        updateData
      );
    } catch (error) {
      console.error('Update feedback form error:', error);
      throw error;
    }
  }
  
  // Delete feedback form (soft delete)
  async deleteFeedbackForm(formId, userId) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.FEEDBACK_FORMS,
        formId,
        { isActive: false }
      );
    } catch (error) {
      console.error('Delete feedback form error:', error);
      throw error;
    }
  }
  
  // ========== STUDENT FEEDBACK SERVICES ==========
  
  // Submit student feedback
  async submitFeedback(feedbackData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.STUDENT_FEEDBACK,
        ID.unique(),
        {
          ...feedbackData,
          ratings: JSON.stringify(feedbackData.ratings), // Store ratings as JSON string
          submittedAt: new Date().toISOString()
        },
        [
          Permission.read(Role.any()) // Allow admins to read all feedback
        ]
      );
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error;
    }
  }
  
  // Get feedback for a specific form
  async getFeedbackForForm(formId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENT_FEEDBACK,
        [Query.equal('formId', formId)]
      );
      
      // Parse ratings JSON for each feedback
      return response.documents.map(feedback => ({
        ...feedback,
        ratings: JSON.parse(feedback.ratings)
      }));
    } catch (error) {
      console.error('Get feedback for form error:', error);
      throw error;
    }
  }
  
  // Get feedback count for a form
  async getFeedbackCount(formId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENT_FEEDBACK,
        [Query.equal('formId', formId)]
      );
      return response.total;
    } catch (error) {
      console.error('Get feedback count error:', error);
      return 0;
    }
  }
  
  // Check if student already submitted feedback
  async checkDuplicateSubmission(formId, studentId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENT_FEEDBACK,
        [
          Query.equal('formId', formId),
          Query.equal('studentId', studentId)
        ]
      );
      return response.total > 0;
    } catch (error) {
      console.error('Check duplicate submission error:', error);
      return false;
    }
  }
  
  // ========== ADMIN SERVICES ==========
  
  // Get all admin users (for file sharing feature)
  async getAdminUsers(currentUserId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [
          Query.equal('role', 'admin'),
          Query.notEqual('userId', currentUserId)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Get admin users error:', error);
      return [];
    }
  }
}

// Export singleton instance
const appwriteService = new AppwriteService();
export default appwriteService;