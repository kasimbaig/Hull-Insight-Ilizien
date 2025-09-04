import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UserCircleIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo: set login flag and redirect
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/';
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-[100vw] h-[100vh] min-h-0 min-w-0 flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=\'60\'%20height=\'60\'%20viewBox=\'0%200%2060%2060\'%20xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg%20fill=\'none\'%20fill-rule=\'evenodd\'%3E%3Cg%20fill=\'%2364B5F6\'%20fill-opacity=\'0.10\'%3E%3Ccircle%20cx=\'7\'%20cy=\'7\'%20r=\'7\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 pointer-events-none"></div>

  <div className="relative w-full max-w-[37vw] md:max-w-[37vw] mx-auto p-0 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 flex items-center justify-center shadow-lg">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-wide">Hull Insight</h1>
          <p className="text-blue-700 font-medium">Naval Vessel Management System</p>
        </div>

        {/* Login Card */}
  <Card className="shadow-2xl border-0 bg-white rounded-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-blue-900 tracking-wide">
              Sign In to Your Account
            </CardTitle>
            <CardDescription className="text-blue-700 font-medium">
              Enter your credentials to access the naval management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-blue-900">
                  Username
                </Label>
                <div className="relative">
                  <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-400 bg-blue-50"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-blue-900">
                  Password
                </Label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-blue-200 focus:border-blue-500 focus:ring-blue-400 bg-blue-50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-blue-200 text-blue-600 focus:ring-blue-400"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-blue-700 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto">
                  Forgot password?
                </Button>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg shadow"
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 text-center mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <div className="flex justify-between">
                  <span>Username:</span>
                  <span className="font-mono">captain.sharma</span>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <span className="font-mono">hull2024</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-blue-700">
              <p>© 2024 Naval Systems Division. All rights reserved.</p>
              <p className="mt-1">
                Contact IT Support for account assistance: 
                <span className="text-blue-600"> support@naval.gov.in</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
//hvac trial(with reports),integrate masterapis,pop up ,tables and login forms widen order by -id