import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' // Default role as per API documentation
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for the specific field when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
    // Clear API message when form data changes
    setApiMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
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

    setIsLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Only send required fields as per API documentation
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (data.success) {
        setApiMessage({ type: 'success', text: `Account created successfully! Welcome, ${data.data.name}. You can now log in.` });
        // Optionally redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle specific error codes or messages from the API
        let errorMessage = 'Account creation failed.';
        if (data.error && data.error.message) {
          errorMessage = data.error.message;
          if (data.error.details && data.error.details.email) {
            errorMessage += `: ${data.error.details.email}`;
          }
        }
        setApiMessage({ type: 'error', text: errorMessage });
      }
    } catch (error) {
      setApiMessage({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // This function can be used to navigate back or close a modal if this component were in one.
    // For now, it just logs to console, but you could add:
    // navigate(-1); // To go back to the previous page
    console.log('Close button clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('/src/assets/reg.jpg')", // Placeholder image
          }}
        ></div>
        <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>
      </div>

      {/* Register Card */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl relative z-10 overflow-hidden">
        {/* Subtle texture overlay for the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-90"></div>
        
        <div className="relative z-10 p-8">
          {/* Close button - currently just logs, can be updated to navigate back */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create an account</h2>

          <p className="text-center text-gray-600 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">Log in</Link>
          </p>

          {apiMessage.text && (
            <div className={`p-3 rounded-md mb-6 ${apiMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {apiMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your name"
              />
              {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>}
            </div>

            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm mt-1 block">{errors.confirmPassword}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
         
              </select>
              {errors.role && <span className="text-red-500 text-sm mt-1 block">{errors.role}</span>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-medium text-lg shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
