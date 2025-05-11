import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/apiInstance';
import { useAuth } from '../App'; // Import the auth context

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  // Get email from URL or localStorage when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Fallback to localStorage or navigate to signup
      const storedEmail = localStorage.getItem('registrationEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        navigate('/signup');
      }
    }
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  // Handle input change for OTP fields
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  // Handle key press for backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs[3].current.focus();
    }
  };
  
  // Submit OTP for verification
  const verifyOtp = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      setStatus({ type: 'error', message: 'Please enter a valid 4-digit OTP' });
      return;
    }
    
    setIsSubmitting(true);
    setStatus(null);
    
    try {
      // Directly use the API endpoint that gets proxied
      const response = await API.post('/verify-otp/', {
        email: email,
        otp: otpValue
      });
      
      console.log('Verification successful:', response);
      
      // Set authentication token from response if available
      if (response.data?.token) {
        login(response.data.token);
      } else {
        // If no token is returned but verification is successful, 
        // create a temporary token for demonstration
        login('verified_user_token');
      }
      
      setStatus({ type: 'success', message: 'OTP verified successfully! Redirecting to homepage...' });
      
      // Remove email from localStorage
      localStorage.removeItem('registrationEmail');
      
      // Redirect to courses page (homepage) after short delay
      setTimeout(() => {
        navigate('/courses');
      }, 1500);
      
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setStatus({ 
          type: 'error', 
          message: error.response.data?.message || `Error: ${error.response.status}`
        });
      } else if (error.request) {
        // The request was made but no response was received (like CORS issue)
        setStatus({ 
          type: 'error', 
          message: 'Network error. Please check your connection or contact support.'
        });
      } else {
        // Something happened in setting up the request
        setStatus({ 
          type: 'error', 
          message: error.message || 'An unexpected error occurred'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Resend OTP
  const resendOtp = async () => {
    if (timeLeft > 0) return;
    
    try {
      const response = await API.post('/resend-otp/', { email });
      console.log('Resend successful:', response);
      
      setStatus({ type: 'success', message: 'New OTP sent successfully' });
      setTimeLeft(60); // Reset timer
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      // More detailed error handling
      if (error.response) {
        setStatus({ 
          type: 'error', 
          message: error.response.data?.message || `Error: ${error.response.status}`
        });
      } else if (error.request) {
        setStatus({ 
          type: 'error', 
          message: 'Network error. Please check your connection or contact support.'
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: error.message || 'Failed to resend OTP'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 4-digit code to <span className="font-medium">{email}</span>
          </p>
        </div>
        
        {status && (
          <div className={`p-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mb-4`}>
            <span>{status.message}</span>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3].map(index => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-2xl font-bold border rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            ))}
          </div>
          
          <div className="form-control mt-6">
            <button
              onClick={verifyOtp}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75' : ''}`}
              disabled={isSubmitting || otp.join('').length !== 4}
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button 
                onClick={resendOtp}
                disabled={timeLeft > 0}
                className={`text-indigo-600 font-medium ${timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
              >
                Resend {timeLeft > 0 ? `(${timeLeft}s)` : ''}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}