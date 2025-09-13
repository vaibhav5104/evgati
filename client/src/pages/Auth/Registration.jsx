import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Register = () => {
    const defaultUser = {
        username: "",
        email: "",
        phone: "",
        password: "",
    };
    
    const [user, setUser] = useState(defaultUser);
    const navigate = useNavigate();
    const { storeTokenInLS, API } = useAuth();

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(user)
            });
            const res_data = await response.json();

            if (response.ok) {
                storeTokenInLS(res_data.token);
                setUser({ username: "", email: "", phone: "", password: "" });
                toast.success("Registration successful");
                navigate("/");
            } else {
                toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API}/api/auth/google-login`, {
                credential: credentialResponse.credential,
            });

            const data = res.data;
            if (data.token) {
                storeTokenInLS(data.token);
                toast.success("Login successful with Google");
                navigate("/");
            } else {
                toast.error("No token received from Google login");
            }

        } catch (err) {
            console.error("Google login error: ", err);
            toast.error("Google login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6">
                    <h2 className="text-center text-3xl font-extrabold text-white">Create Account</h2>
                    <p className="mt-2 text-center text-sm text-blue-100">
                        Join us today and start exploring
                    </p>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    autoComplete="username"
                                    value={user.username}
                                    onChange={handleInput}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400"
                                    placeholder="johnsmith"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    autoComplete="email"
                                    value={user.email}
                                    onChange={handleInput}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    required
                                    autoComplete="tel"
                                    value={user.phone}
                                    onChange={handleInput}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    autoComplete="new-password"
                                    value={user.password}
                                    onChange={handleInput}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Password must be at least 8 characters</p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or register with</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="w-full">
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={() => console.log('Registration Failed')}
                                    width="100%"
                                    size="large"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                        <div className="text-sm">
                            <span className="text-gray-500">Already have an account?</span>{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Register