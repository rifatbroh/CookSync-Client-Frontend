import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-green-900 text-white pt-12 px-6 md:px-12 mt-12">
            {/* Top Grid Section */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-6">LINKS</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><a href="#" className="hover:text-white">Recipes</a></li>
                        <li><a href="#" className="hover:text-white">Articles</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>

                {/* Legal & Support */}
                <div>
                    <h3 className="text-lg font-semibold mb-6">LEGAL & SUPPORT</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><a href="#" className="hover:text-white">Terms of service</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                    </ul>
                </div>

                {/* App Download */}
                <div>
                    <h3 className="text-lg font-semibold mb-6">DOWNLOAD THE APP</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><a href="#" className="hover:text-white">Get it on Google Play</a></li>
                        <li><a href="#" className="hover:text-white">Download on the App Store</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold mb-6">Sign up for our Newsletter</h3>
                    <p className="text-sm text-gray-300 mb-4">
                        Subscribe & start receiving your weekly dose of delicious inspiration!
                    </p>
                    <input
                        type="email"
                        placeholder="name@gdomain.com"
                        className="w-full p-3 mb-3 rounded text-black bg-white text-sm focus:outline-none"
                    />
                    <button className="bg-white text-green-900 font-semibold px-6 py-2 rounded hover:bg-gray-200 transition">
                        SUBSCRIBE
                    </button>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 text-center mt-12 py-6 text-gray-300 text-sm">
                &copy; 2025 Cooksync. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
