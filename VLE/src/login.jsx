import { useState } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' }); // Added for API messages
  const [isLoading, setIsLoading] = useState(false); // Added for loading state
  const handleClose = () => {
    // This function can be used to navigate back or close a modal if this component were in one.
    // For now, it just logs to console, but you could add:
    // navigate(-1); // To go back to the previous page
    console.log('Close button clicked');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    // Clear API message when form data changes
    setApiMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage({ type: '', text: '' }); // Clear previous API messages

    if (!validateForm()) {
      setApiMessage({ type: 'error', text: 'Please correct the errors in the form.' });
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await fetch('/api/auth/login', { // Assuming /api/auth/login is your login endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) { // Check both response.ok for 2xx status and data.success
        setApiMessage({ type: 'success', text: 'Login successful! Redirecting to dashboard...' });
        // In a real app, you'd store the token (e.g., in localStorage, secure cookie, or Context)
        // localStorage.setItem('userToken', data.data.token); // Example: store token
        // localStorage.setItem('userData', JSON.stringify(data.data.user)); // Example: store user data

        // Redirect to dashboard or home page after a short delay
        setTimeout(() => {
          navigate('/dashboard'); // Replace with your actual dashboard/home route
        }, 1500);
      } else {
        // Handle API error response
        let errorMessage = 'Login failed.';
        if (data.error && data.error.message) {
          errorMessage = data.error.message;
        } else if (data.message) { // Sometimes generic error messages might be in `message`
          errorMessage = data.message;
        }
        setApiMessage({ type: 'error', text: errorMessage });
      }
    } catch (error) {
      console.error('Network error during login:', error);
      setApiMessage({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center scale-105"
          style={{ 
            backgroundImage: "url('/src/assets/reg.jpg')", // Ensure this path is correct or replace with a placeholder
          }}
        ></div>
        <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>
      </div>
      
      {/* Login Card */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl relative z-10 overflow-hidden">
        {/* Subtle texture overlay for the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-90"></div>
        
        <div className="relative z-10 p-8">
                      <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">LOGIN</h2>
          
          <p className="text-center text-gray-600 mb-8">
            Don't have an account?{' '}
            <Link to ="/register" className="text-blue-500 hover:underline font-medium">Sign up</Link>
          </p>
          
          {/* Display API messages (success or error) */}
          {apiMessage.text && (
            <div className={`p-3 rounded-md mb-6 ${apiMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {apiMessage.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>}
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <a href="#forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-medium text-lg shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'LOGIN'} {/* Change button text during loading */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default Login;
