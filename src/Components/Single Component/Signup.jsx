import React from 'react';
import signupImage from '../../assets/signup.jpeg'

const Signup = () => {
    return (
        <div className="flex min-h-screen">
            {/* Left Panel */}
            <div
                className="hidden md:flex flex-1 bg-cover bg-center items-center justify-center text-white px-10"
                style={{ backgroundImage: `url(${signupImage})` }}
            >
                <div className="max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Embark on a culinary journey with us!</h2>
                    <p className="text-lg leading-relaxed">
                        Sign up to unlock a world of delicious recipes, and personalized cooking experiences.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 bg-white flex flex-col justify-center px-8 py-12">
                <div className="max-w-md w-full mx-auto">
                    <div className="text-2xl font-bold text-green-900 mb-2">🍴 CookSync</div>
                    <h1 className="text-2xl font-semibold mb-6">Create an Account</h1>

                    {/* Social Buttons */}
                    <div className="flex gap-4 mb-4">
                        <button className="flex-1 py-3 border border-gray-300 rounded font-semibold bg-white hover:bg-gray-100 transition">
                            🔵 Sign up with Facebook
                        </button>
                        <button className="flex-1 py-3 border border-gray-300 rounded font-semibold bg-white hover:bg-gray-100 transition">
                            🟥 Sign up with Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="px-4 text-gray-500 text-sm">OR</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    {/* Signup Form */}
                    <form>
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                        <input
                            type="email"
                            placeholder="E-mail Address"
                            required
                            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full px-4 py-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-900 text-white font-bold rounded hover:bg-green-800 transition"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="text-center text-gray-600 mt-6">
                        Already have an account?{' '}
                        <a href="../login/login.html" className="text-green-900 font-semibold hover:underline">
                            Log In
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
