import { useEffect, useState } from "react";
import { FaClock, FaHeart, FaTrash, FaUtensils } from "react-icons/fa";
import axios from "../Components/utils/axios";

// Helpers
const getUserFromLocalStorage = () => {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
};

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const user = getUserFromLocalStorage();
        if (user?.id) {
            axios.get(`/chef/${user.id}`).then((res) => setRecipes(res.data));
        }
        setRole(user?.role || null);
    }, []);

    const loadRecipes = async () => {
        const user = getUserFromLocalStorage();
        if (!user?.id) return;

        const res = await axios.get(`/chef/${user.id}`);
        setRecipes(res.data);
    };

    const openModal = async (id) => {
        try {
            const res = await axios.get(`/recipes/${id}`);
            setSelectedRecipe(res.data);
            setComments(res.data.comments || []);
            setShowModal(true);

            await axios.post(`/recipes/${id}/view`);

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
        setComments([]);
        setComment("");
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

    const handleLike = async () => {
        try {
            await axios.post(`/recipes/${selectedRecipe._id}/like`);
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        try {
            const res = await axios.post(
                `/recipes/${selectedRecipe._id}/comment`,
                { text: comment }
            );
            setComments((prev) => [...prev, res.data]);
            setComment("");
        } catch (err) {
            console.error("Add comment failed", err);
        }
    };

    const handleAdminDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this recipe?")) return;
        try {
            await axios.delete(`/api/recipes/admin/${id}`);
            alert("🗑️ Recipe deleted successfully.");
            await loadRecipes();
        } catch (err) {
            console.error("Admin delete failed", err);
            alert("❌ Failed to delete recipe");
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
                <div
                    key={recipe._id}
                    className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                >
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        onClick={() => openModal(recipe._id)}
                        className="cursor-pointer h-48 w-full object-cover"
                    />
                    <div className="p-4 space-y-2">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                            {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
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
                                    className="text-xs bg-[#469b7e]/10 text-[#469b7e] px-2 py-0.5 rounded-full font-medium"
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

                    {role === "admin" && (
                        <button
                            onClick={() => handleAdminDelete(recipe._id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>
            ))}

            {/* Modal */}
            {showModal && selectedRecipe && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white max-w-2xl w-full max-h-[90vh] rounded-2xl p-8 relative shadow-2xl overflow-y-auto transform scale-95 animate-scaleUp">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl transition-transform duration-200 transform hover:rotate-90"
                        >
                            &times;
                        </button>

                        <img
                            src={selectedRecipe.imageUrl}
                            alt={selectedRecipe.title}
                            className="w-full h-72 object-cover rounded-xl mb-6 shadow-md"
                        />

                        <h2 className="text-3xl font-extrabold mt-4 mb-3 text-gray-900 border-b pb-2">
                            {selectedRecipe.title}
                        </h2>

                        <p className="text-gray-700 mb-5 leading-relaxed">
                            {selectedRecipe.description}
                        </p>

                        <div className="text-base text-gray-800 space-y-3 mb-6">
                            <div>
                                <strong className="block text-lg mb-1">
                                    Ingredients:
                                </strong>
                                <ul className="list-disc list-inside pl-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                                    {selectedRecipe.ingredients.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                            <div>
                                <strong className="block text-lg mb-1">
                                    Instructions:
                                </strong>
                                <ol className="list-decimal list-inside pl-2 space-y-1">
                                    {selectedRecipe.instructions.map(
                                        (step, index) => (
                                            <li key={index}>{step}</li>
                                        )
                                    )}
                                </ol>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-700 mb-1">
                                    <strong className="text-gray-800">
                                        Preparation Time:
                                    </strong>{" "}
                                    {selectedRecipe.prepTime} mins
                                </p>
                                <p className="text-gray-700">
                                    <strong className="text-gray-800">
                                        Cook Time:
                                    </strong>{" "}
                                    {selectedRecipe.cookTime} mins
                                </p>
                            </div>
                            {selectedRecipe.nutrition && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-700 mb-1">
                                        <strong className="text-gray-800">
                                            Calories:
                                        </strong>{" "}
                                        {selectedRecipe.nutrition.calories ||
                                            "N/A"}{" "}
                                        kcal
                                    </p>
                                    <p className="text-gray-700 mb-1">
                                        <strong className="text-gray-800">
                                            Protein:
                                        </strong>{" "}
                                        {selectedRecipe.nutrition.protein ||
                                            "N/A"}{" "}
                                        g
                                    </p>
                                    <p className="text-gray-700 mb-1">
                                        <strong className="text-gray-800">
                                            Carbs:
                                        </strong>{" "}
                                        {selectedRecipe.nutrition.carbs ||
                                            "N/A"}{" "}
                                        g
                                    </p>
                                    <p className="text-gray-700">
                                        <strong className="text-gray-800">
                                            Fats:
                                        </strong>{" "}
                                        {selectedRecipe.nutrition.fats || "N/A"}{" "}
                                        g
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={toggleFavorite}
                                disabled={favoriteLoading}
                                className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
                                    isFavorite
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-[#469b7e] text-white hover:bg-[#377f66]"
                                } ${
                                    favoriteLoading
                                        ? "opacity-60 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isFavorite
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"}
                            </button>

                            <button
                                onClick={handleLike}
                                className="flex-1 py-3 px-6 rounded-xl font-bold text-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                            >
                                Like Recipe
                            </button>
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <h4 className="text-xl font-bold text-gray-900 mb-4">
                                Comments ({comments.length})
                            </h4>
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar mb-4">
                                {comments.length === 0 ? (
                                    <p className="text-gray-500 text-center">
                                        No comments yet. Be the first to
                                        comment!
                                    </p>
                                ) : (
                                    comments.map((c) => (
                                        <div
                                            key={c._id}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                                        >
                                            <span className="text-gray-800 text-sm flex-grow pr-4">
                                                <strong className="text-gray-900">
                                                    {c.author || "Anonymous"}:
                                                </strong>{" "}
                                                {c.text}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-4 flex gap-3">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 border border-gray-300 focus:border-[#469b7e] focus:ring-1 focus:ring-[#469b7e] px-4 py-2 rounded-lg text-gray-700 transition-all duration-200"
                                />
                                <button
                                    onClick={handleAddComment}
                                    className="bg-[#469b7e] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#377f66] transition-colors duration-200"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllRecipes;
