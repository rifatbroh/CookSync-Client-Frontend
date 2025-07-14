import { useEffect, useState } from "react";
import { FaClock, FaHeart, FaUtensils } from "react-icons/fa";
import axios from "../Components/utils/axios";

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        axios.get("/recipes").then((res) => setRecipes(res.data));
    }, []);

    const openModal = async (id) => {
        try {
            const res = await axios.get(`/recipes/${id}`);
            setSelectedRecipe(res.data);
            setShowModal(true);

            const favRes = await axios.get("/users/favorites");
            const isFav = favRes.data.some((fav) => fav._id === id);
            setIsFavorite(isFav);
        } catch (err) {
            console.error("Failed to load recipe", err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRecipe(null);
        setIsFavorite(false);
    };

    const toggleFavorite = async () => {
        if (!selectedRecipe?._id) return;
        setFavoriteLoading(true);
        try {
            await axios.post(`/users/favorites/${selectedRecipe._id}`);
            setIsFavorite((prev) => !prev);
        } catch (err) {
            console.error("Toggle favorite failed", err);
        } finally {
            setFavoriteLoading(false);
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
                <div
                    key={recipe._id}
                    onClick={() => openModal(recipe._id)}
                    className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition duration-300 overflow-hidden"
                >
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-48 w-full object-cover"
                    />
                    <div className="p-4 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                            {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                            {recipe.description}
                        </p>
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
                        <div className="mt-3 text-sm text-gray-600 flex items-center gap-1">
                            <FaHeart className="text-red-500" />
                            {recipe.likes?.length || 0} likes
                        </div>
                    </div>
                </div>
            ))}

            {showModal && selectedRecipe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white max-w-lg w-full rounded-xl p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <img
                            src={selectedRecipe.imageUrl}
                            alt={selectedRecipe.title}
                            className="w-full h-64 object-cover rounded-md"
                        />

                        <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-800">
                            {selectedRecipe.title}
                        </h2>

                        <p className="text-gray-600 mb-3">
                            {selectedRecipe.description}
                        </p>

                        <div className="text-sm text-gray-700 space-y-1">
                            <p>
                                <strong>Ingredients:</strong>{" "}
                                {selectedRecipe.ingredients.join(", ")}
                            </p>
                            <p>
                                <strong>Instructions:</strong>{" "}
                                {selectedRecipe.instructions.join(" → ")}
                            </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-100 p-2 rounded-md">
                                <p>
                                    <strong>Prep:</strong>{" "}
                                    {selectedRecipe.prepTime} min
                                </p>
                                <p>
                                    <strong>Cook:</strong>{" "}
                                    {selectedRecipe.cookTime} min
                                </p>
                            </div>
                            <div className="bg-gray-100 p-2 rounded-md">
                                <p>
                                    <strong>Calories:</strong>{" "}
                                    {selectedRecipe.nutrition?.calories}
                                </p>
                                <p>
                                    <strong>Protein:</strong>{" "}
                                    {selectedRecipe.nutrition?.protein}g
                                </p>
                                <p>
                                    <strong>Carbs:</strong>{" "}
                                    {selectedRecipe.nutrition?.carbs}g
                                </p>
                                <p>
                                    <strong>Fats:</strong>{" "}
                                    {selectedRecipe.nutrition?.fats}g
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={toggleFavorite}
                            disabled={favoriteLoading}
                            className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition ${
                                isFavorite
                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                    : "bg-green-500 text-white hover:bg-green-600"
                            } ${
                                favoriteLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {isFavorite
                                ? "Remove from Favorites"
                                : "Add to Favorites"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllRecipes;
