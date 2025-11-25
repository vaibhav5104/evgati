import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { GoogleLogin } from '@react-oauth/google';
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { EvCharger } from "lucide-react";


const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const { storeTokenInLS, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Keep phone as string to avoid leading-zero issues
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      phone: Number(formData.phone)   // convert here only
    };

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(payload),
      });

      const res_data = await response.json();
      console.log(res_data);

      if (response.ok) {
        storeTokenInLS(res_data.token);
        setFormData({ name: "", email: "", password: "", phone: "" });
        toast.success("Registration successful");
        navigate("/");
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success("Registration successful with Google!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 md:py-20 py-12 ">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
        <div className="flex gap-3 justify-center">
          <EvCharger className="w-10 h-10" fill="orange"/>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2></div>
          <p className="text-gray-600 mt-2">Join EvGati and start your EV journey</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">

            <Input
              label="Full Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            <Input
              label="Phone Number"
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              pattern="[0-9]*"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            {/* Password with Show/Hide */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Create Account
            </Button>

          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or Login with</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="mt-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google registration failed')}
                size="large"
                width="100%"
              />
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

        </Card>
      </div>
    </div>
  );
};

export default Register;
