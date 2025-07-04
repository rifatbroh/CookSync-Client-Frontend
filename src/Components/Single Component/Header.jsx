import React from 'react';

const Header = () => {
    return (
        <div className="header">
            <header className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-200 bg-white">
                {/* Left Logo */}
                <div className="flex items-center text-green-900 font-semibold text-lg">
                    <span className="text-xl mr-2">🍴</span>
                    <span>Cooksync</span>
                </div>

                {/* Center Nav Links */}
                <nav className="flex space-x-6">
                    <a href="index.html" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">Home</a>
                    <a href="#" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">Favourite</a>
                    <a href="about/about.html" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">About us</a>
                </nav>

                {/* Right Buttons */}
                <div className="flex items-center space-x-4">
                    <a href="login/login.html">
                        <button className="px-4 py-2 border border-green-700 text-green-700 font-semibold rounded hover:bg-green-100 transition">Log in</button>
                    </a>
                    <a href="singup/signup.html">
                        <button className="px-4 py-2 bg-green-700 text-white font-semibold rounded hover:bg-green-800 transition">Sign up</button>
                    </a>
                </div>
            </header>
        </div>
    );
};

export default Header;
