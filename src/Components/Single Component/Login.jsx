import React from 'react';
import loginImage from '../../assets/login.jpeg';

const Login = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Image Section */}
            <div className="hidden md:flex w-1/2 bg-gray-300 items-center justify-center">
                <img src={loginImage} alt="Login" className="w-3/4 h-auto object-cover" />
            </div>

            {/* Right Login Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-green-900">🍴CookSync</h1>
                </div>

                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

                    {/* Social Buttons */}
                    <div className="flex flex-col gap-4 mb-6">
                        <button className="w-full py-2 border border-gray-300 rounded font-semibold bg-white hover:bg-gray-50 transition">
                            Login with Facebook
                        </button>
                        <button className="w-full py-2 border border-gray-300 rounded font-semibold bg-white hover:bg-gray-50 transition">
                            Login with Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="px-4 text-gray-500 text-sm">OR</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    {/* Form */}
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                E-mail Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your e-mail"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition"
                        >
                            Login
                        </button>
                    </form>

                    {/* Sign-up Link */}
                    <div className="text-center text-gray-600 mt-6">
                        Don&apos;t have an account?{' '}
                        <a href="../singup/signup.html" className="text-red-500 font-bold hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
