import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/apiInstance';

export default function SignupPage() {
  const navigate = useNavigate();
  
  // Use the exact field names expected by the API
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone_number)) newErrors.phone_number = 'Enter a valid 10-digit phone number';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: null});
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Use the exact field names expected by the API
        const payload = {
          full_name: formData.full_name.trim(),
          phone_number: formData.phone_number.trim(),
          email: formData.email.trim()
        };

        console.log('Sending registration data:', payload);
        
        const response = await API.post('/register/', payload);
        console.log('Registration response:', response.data);
        
        setSubmissionStatus({type: 'success', message: 'Registration successful! Redirecting to verification...'});
        
        // Store email in localStorage for the OTP verification page
        localStorage.setItem('registrationEmail', formData.email);
        
        // Modified: Redirect to login page after signup
        setTimeout(() => {
          navigate('/login', { state: { fromSignup: true, email: formData.email } });
        }, 1500);
      } catch (error) {
        console.error('Registration error:', error);
        
        // Extract and display error details
        let errorMessage = 'Registration failed';
        
        if (error.response?.data) {
          const errorData = error.response.data;
          console.log('Error response data:', errorData);
          
          // Handle various error formats
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors[0];
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else {
            // Check for field-specific errors
            const fieldErrors = [];
            for (const [field, errors] of Object.entries(errorData)) {
              if (Array.isArray(errors) && errors.length > 0) {
                fieldErrors.push(`${field}: ${errors[0]}`);
              }
            }
            
            if (fieldErrors.length > 0) {
              errorMessage = fieldErrors.join(', ');
            }
          }
        }
        
        setSubmissionStatus({
          type: 'error',
          message: errorMessage
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-600">Join our platform today</p>
        </div>
        
        {submissionStatus && (
          <div className={`p-4 rounded ${submissionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mb-4`}>
            <span>{submissionStatus.message}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name" // Updated to match API field name
              value={formData.full_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.full_name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.full_name && <span className="text-red-500 text-xs mt-1">{errors.full_name}</span>}
          </div>
          
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone_number" // Updated to match API field name
              value={formData.phone_number}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.phone_number ? 'border-red-500' : ''}`}
              placeholder="1234567890"
            />
            {errors.phone_number && <span className="text-red-500 text-xs mt-1">{errors.phone_number}</span>}
          </div>
          
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
          </div>
          
          <div className="form-control mt-6">
            <button
              onClick={handleSubmit}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 font-medium hover:underline">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}