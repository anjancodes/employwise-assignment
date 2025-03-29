import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Login Component
 * Handles user authentication using the Reqres API
 * Stores authentication token in localStorage upon successful login
 */
function Login() {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle form submission for login
   * @param {Event} e - Form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic form validation
    if (!email.includes('@') || password.length < 6) {
      setError('Please enter a valid email and password (min 6 characters).');
      return;
    }
    
    setLoading(true);
    try {
      // API call to login endpoint
      const response = await axios.post('https://reqres.in/api/login', { email, password });
      // Store token in localStorage for persistent auth
      localStorage.setItem('token', response.data.token);
      // Redirect to users page on successful login
      navigate('/users');
    } catch (err) {
      // Handle login errors
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Full-height container with responsive padding
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      {/* Card container with responsive width and padding */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none transition-colors"
              placeholder="eve.holt@reqres.in"
              required
              aria-label="Email"
            />
          </div>
          
          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none transition-colors"
              placeholder="cityslicka"
              required
              aria-label="Password"
            />
          </div>
          
          {/* Submit button with loading state */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            aria-busy={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Error message display */}
        {error && (
          <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-500 text-center text-sm">{error}</p>
          </div>
        )}
        
        {/* Login hint */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          Hint: Use eve.holt@reqres.in and cityslicka
        </p>
      </div>
    </div>
  );
}

export default Login;
