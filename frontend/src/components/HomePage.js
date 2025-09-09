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
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Teacher Feedback Collection System
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              A comprehensive platform for collecting and managing student feedback on teaching effectiveness
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Dynamic Forms</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Create customizable feedback forms with subjects and evaluation criteria
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Easy Sharing</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Share feedback forms with students through secure shareable links
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-purple-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Data Export</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Export feedback data in Excel format for analysis and reporting
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Access Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  For Students
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Access feedback forms through links shared by your teachers
                </p>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter form ID or paste form link"
                    value={directFormId}
                    onChange={(e) => setDirectFormId(e.target.value)}
                    className="text-sm sm:text-base"
                  />
                  <Button onClick={handleDirectAccess} className="w-full text-sm sm:text-base py-2 sm:py-3">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Access Form
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/student-login')}
                    className="w-full text-sm sm:text-base py-2 sm:py-3"
                  >
                    Student Login
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  For Teachers/Admins
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Create and manage feedback forms, view responses and export data
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/admin-login')}
                    className="w-full text-sm sm:text-base py-2 sm:py-3"
                  >
                    Admin Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/register')}
                    className="w-full text-sm sm:text-base py-2 sm:py-3"
                  >
                    Register as Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 sm:mt-10 lg:mt-12 text-gray-500 px-2">
            <p className="text-sm sm:text-base">Secure • Easy to use • Comprehensive feedback collection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Welcome, {user?.username}!</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <p className="text-sm sm:text-base text-gray-600">
              You can access feedback forms through links shared by your teachers.
            </p>
            
            <div className="mt-4 sm:mt-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Enter Form ID or Paste Form Link
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Input
                    placeholder="Form ID or full form link"
                    value={directFormId}
                    onChange={(e) => setDirectFormId(e.target.value)}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button onClick={handleDirectAccess} className="text-sm sm:text-base py-2 sm:py-3 sm:px-4">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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