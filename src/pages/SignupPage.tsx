import React from 'react';
import { Navigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const { user, loading } = useAuth();
  
  // Redirect authenticated users to dashboard
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">ChatZone</h1>
          <p className="text-muted-foreground mt-2">
            Create an account to start chatting with AI
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage; 