import React, { useState } from 'react';
import appwriteService from '../services/appwriteService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

const AppwriteTest = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test Admin',
    username: 'testadmin'
  });

  const runTest = async (testName, testFunction) => {
    try {
      setLoading(true);
      setStatus(prev => prev + `\n🧪 Running ${testName}...`);
      const result = await testFunction();
      setStatus(prev => prev + `\n✅ ${testName} successful: ${JSON.stringify(result, null, 2)}`);
      return result;
    } catch (error) {
      setStatus(prev => prev + `\n❌ ${testName} failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setStatus('🚀 Starting Appwrite Connection Test...\n');
    
    try {
      // Test 1: Check if we can connect to Appwrite
      await runTest('Appwrite Connection', async () => {
        return 'Connected to Appwrite successfully';
      });

      // Test 2: Try to get current user (should fail if not logged in)
      await runTest('Current User Check', async () => {
        const user = await appwriteService.getCurrentUser();
        return user ? `Logged in as: ${user.email}` : 'No user logged in';
      });

    } catch (error) {
      setStatus(prev => prev + `\n💥 Test suite failed: ${error.message}`);
    }
  };

  const testFullWorkflow = async () => {
    setStatus('🧪 Starting Full Workflow Test...\n');
    
    try {
      // Test 1: Register user
      const user = await runTest('User Registration', async () => {
        return await appwriteService.register(
          testData.email, 
          testData.password, 
          testData.name, 
          testData.username
        );
      });

      // Test 2: Login
      await runTest('User Login', async () => {
        return await appwriteService.login(testData.email, testData.password);
      });

      // Test 3: Create feedback form
      const form = await runTest('Create Feedback Form', async () => {
        return await appwriteService.createFeedbackForm({
          title: 'Test Feedback Form',
          year: '2024-25',
          section: 'A',
          department: 'Computer Science',
          subjects: JSON.stringify(['Math', 'Physics', 'Chemistry']),
          evaluationCriteria: JSON.stringify(['Teaching Quality', 'Content Delivery'])
        }, user.$id);
      });

      // Test 4: Submit feedback
      await runTest('Submit Student Feedback', async () => {
        return await appwriteService.submitFeedback({
          formId: form.$id,
          studentId: 'student123',
          studentName: 'Test Student',
          ratings: { Math: { 'Teaching Quality': 5 } },
          comments: 'Great teaching!'
        });
      });

      setStatus(prev => prev + '\n\n🎉 All tests passed! Appwrite is working correctly!');

    } catch (error) {
      setStatus(prev => prev + `\n💥 Workflow test failed: ${error.message}`);
    }
  };

  const clearStatus = () => {
    setStatus('');
  };

  const handleInputChange = (field, value) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Appwrite Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Test Data Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Test Email</label>
              <Input 
                value={testData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Test Password</label>
              <Input 
                type="password"
                value={testData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="password123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Test Name</label>
              <Input 
                value={testData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Test Admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Test Username</label>
              <Input 
                value={testData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="testadmin"
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={testConnection}
              disabled={loading}
              variant="outline"
            >
              Test Connection
            </Button>
            <Button 
              onClick={testFullWorkflow}
              disabled={loading}
            >
              Test Full Workflow
            </Button>
            <Button 
              onClick={clearStatus}
              variant="secondary"
            >
              Clear Results
            </Button>
          </div>

          {/* Status Display */}
          {status && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                  {status}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Alert>
            <AlertDescription>
              <strong>Before testing:</strong>
              <br />
              1. Make sure you've created your Appwrite project
              <br />
              2. Update REACT_APP_APPWRITE_PROJECT_ID in .env.local
              <br />
              3. Create the database collections as described in the migration guide
              <br />
              4. Set up proper permissions for each collection
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </div>
  );
};

export default AppwriteTest;