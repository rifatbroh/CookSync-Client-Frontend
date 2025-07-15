import React from 'react';
import heroBg from "../../assets/hero-bg.jpeg";

const Hero = () => {
    return (
        <section
            className="relative bg-cover bg-center text-white py-20 px-6 min-h-[calc(100vh)] flex items-center justify-center"
            style={{ backgroundImage: `url(${heroBg})` }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-black/50 z-0"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl">
                <h1 className="text-4xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                    Discover Flavors  Food <br></br> <span className="text-lime-400">That Inspire</span>
                </h1>
                <p className="mt-5 text-base md:text-[16px] font-light text-gray-200 max-w-2xl mx-auto">
                    Unlock a world of recipes that delight your senses and nourish your body. Whether you're craving something cozy or bold — we’ve got it all.
                </p>

                {/* Slim Search Bar */}
                <div className="mt-8 relative w-full max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="w-full px-5 py-3 rounded-full text-sm md:text-base text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 transition duration-300 shadow-lg pr-14"
                    />
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-lime-600 hover:bg-lime-700 text-white p-2.5 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-lime-300 transition-transform duration-200 hover:scale-105"
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
