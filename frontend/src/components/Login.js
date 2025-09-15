import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AppwriteAuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, User, Shield } from 'lucide-react';

import { toast } from 'sonner';

import Footer from './Footer';


const Login = ({ role = 'admin' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      
      toast.success('Signed in successfully', {
        description: 'Redirecting to admin dashboard...',
        duration: 2500,
      });
      navigate('/admin');
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      toast.error('Sign in failed', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const isAdminLogin = role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin Login
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Access the admin dashboard to manage feedback forms
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 space-y-2">
            <div className="text-center text-sm text-gray-600">
              Don't have an admin account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Register here
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;