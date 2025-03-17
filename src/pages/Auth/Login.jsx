import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import authBg from '../../assets/auth.png';
import Footer from '../../components/Shared/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Main Container with Background */}
      <div 
        className="min-h-screen pt-8 mt-20 relative"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Form Container */}
        <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Auth Type Selector */}
            <div className="flex text-2xl font-semibold border-b relative">
              <Link 
                to="/signup" 
                className="flex-1 text-center py-4 text-gray-500 hover:text-gray-700"
              >
                Sign up
              </Link>
              <Link 
                to="/login" 
                className="flex-1 text-center py-4 text-gray-900"
              >
                Log in
              </Link>
              {/* Active Indicator Line */}
              <div 
                className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-[#B4A481]"
              />
            </div>
                        {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8"> {/* Increased from space-y-6 to space-y-8 */}
                {/* Email Field */}
                <div className="space-y-3"> {/* Added space between label and input */}
                <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                />
                </div>

                {/* Password Field */}
                <div className="space-y-3"> {/* Added space between label and input */}
                <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                />
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Forgot your password?</span>
                <button 
                    type="button"
                    className="text-[#B4A481] hover:underline ml-2"
                >
                    Reset password
                </button>
                </div>

                {/* Login Button */}
                <button
                type="submit"
                className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                Log in
                </button>
            </div>
            </form>

            {/* Added Footer */}
            <div className="h-1 bg-[#B4A481] mt-0 opacity-75" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;