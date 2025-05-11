import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/apiInstance';
import { useAuth } from '../App'; // Import the auth context

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  // If coming from signup, pre-fill the email
  useEffect(() => {
    if (location.state?.fromSignup && location.state?.email) {
      setEmail(location.state.email);
      setStatus({ 
        type: 'info', 
        message: 'Your account was created successfully. Please login to continue.'
      });
    }
  }, [location]);

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (validateEmail()) {
      setIsSubmitting(true);
      setStatus(null);
      
      try {
        // Send only the email to the login endpoint
        const response = await API.post('/login/', { email });
        
        // Store email for OTP verification
        localStorage.setItem('registrationEmail', email);
        
        setStatus({ 
          type: 'success', 
          message: 'Login link sent to your email! Redirecting to verification...' 
        });
        
        // Redirect to OTP verification page after short delay
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 1500);
        
      } catch (error) {
        console.error('Login error:', error);
        
        setStatus({ 
          type: 'error', 
          message: error.response?.data?.message || 'Failed to send login link. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle key press for Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to OrbiLearn</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your email to sign in</p>
        </div>
        
        {status && (
          <div className={`p-4 rounded mb-4 ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 
            status.type === 'info' ? 'bg-blue-100 text-blue-700' : 
            'bg-red-100 text-red-700'}`}
          >
            <span>{status.message}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
          </div>
          
          <div className="form-control mt-6">
            <button
              onClick={handleSubmit}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Login Link'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-indigo-600 font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}