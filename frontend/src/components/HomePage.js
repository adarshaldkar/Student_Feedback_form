import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, ExternalLink, Calendar, Users, BookOpen } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://students-feedback-system-3.onrender.com';
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [directFormId, setDirectFormId] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

  const fetchPublicForms = async () => {
    // This would be for publicly available forms if needed
    // For now, students access forms through direct links
  };

  const handleDirectAccess = () => {
    if (directFormId.trim()) {
      navigate(`/student/${directFormId.trim()}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Teacher Feedback Collection System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform for collecting and managing student feedback on teaching effectiveness
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Dynamic Forms</h3>
                <p className="text-gray-600">
                  Create customizable feedback forms with subjects and evaluation criteria
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share feedback forms with students through secure shareable links
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Data Export</h3>
                <p className="text-gray-600">
                  Export feedback data in Excel format for analysis and reporting
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Access Section */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  For Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access feedback forms through links shared by your teachers
                </p>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter form ID or paste form link"
                    value={directFormId}
                    onChange={(e) => setDirectFormId(e.target.value)}
                  />
                  <Button onClick={handleDirectAccess} className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Access Form
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/student-login')}
                    className="w-full"
                  >
                    Student Login
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  For Teachers/Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create and manage feedback forms, view responses and export data
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate('/admin-login')}
                    className="w-full"
                  >
                    Admin Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/register')}
                    className="w-full"
                  >
                    Register as Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500">
            <p>Secure • Easy to use • Comprehensive feedback collection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.username}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You can access feedback forms through links shared by your teachers.
            </p>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Form ID or Paste Form Link
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Form ID or full form link"
                    value={directFormId}
                    onChange={(e) => setDirectFormId(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleDirectAccess}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Access
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;