import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast, ToastComponent } = useToast();
  
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      toast({
        title: "Success",
        description: message,
      });
    }
  }, [location.state, toast]);
  
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
            Log in to continue to your AI chat assistant
          </p>
        </div>
        <LoginForm />
      </div>
      <ToastComponent />
    </div>
  );
};

export default LoginPage; 