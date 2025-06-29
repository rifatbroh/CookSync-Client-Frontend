import React from 'react';
import heroBg from '../../assets/hero-bg.jpeg'

const Hero = () => {
    return (
        <section
            className="bg-cover bg-center text-white text-center py-24 px-4"
            style={{ backgroundImage: `url(${heroBg})` }}
        >
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                    Fuel your body & soul <br />find recipes that taste amazing!
                </h1>
                <input
                    type="text"
                    placeholder="Search by dish, ingredient, …"
                    className="w-full max-w-md px-6 py-3 rounded-full text-black bg-white placeholder-gray-500 focus:outline-none shadow-md"
                />
            </div>
        </section>
    );
};

export default Hero;
