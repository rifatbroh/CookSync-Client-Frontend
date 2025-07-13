import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { FaClock, FaHeart, FaUtensils } from 'react-icons/fa';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('/recipes').then((res) => setRecipes(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe._id}
          className="bg-white rounded-xl shadow hover:shadow-md transition duration-300 overflow-hidden"
        >
          {/* Image */}
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-48 w-full object-cover"
          />

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {recipe.title}
            </h3>

            <p className="text-sm text-gray-500 line-clamp-2">
              {recipe.description}
            </p>

            {/* Time & Servings */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <FaClock className="text-[#469b7e]" />
                {recipe.totalTime} mins
              </span>
              <span className="flex items-center gap-1">
                <FaUtensils className="text-[#469b7e]" />
                {recipe.servings} servings
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.tags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-[#469b7e]/10 text-[#469b7e] px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Likes */}
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-1">
              <FaHeart className="text-red-500" />
              {recipe.likes?.length || 0} likes
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllRecipes;
