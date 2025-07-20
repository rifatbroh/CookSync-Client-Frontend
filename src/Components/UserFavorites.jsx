import { useEffect, useState } from "react";
import axios from "../Components/utils/axios";
import CreateRecipe from "./CreateRecipe";

export default function UserFavorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalRecipe, setModalRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/users/favorites");
            setFavorites(res.data);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to load favorites");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const openCreateModal = () => {
        setModalRecipe(null);
        setIsModalOpen(true);
    };

    const openEditModal = (recipe) => {
        setModalRecipe(recipe);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        loadFavorites();
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this recipe?")) return;
        try {
            await axios.delete(`/recipes/${id}`);
            alert("🗑️ Recipe deleted");
            loadFavorites();
        } catch {
            alert("❌ Failed to delete recipe");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Your Favorite Recipes
                </h1>
                <button
                    onClick={openCreateModal}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    + Add Recipe
                </button>
            </div>

            {loading ? (
                <p className="text-gray-600">Loading favorites...</p>
            ) : favorites.length === 0 ? (
                <p className="text-gray-500">You have no favorite recipes.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((recipe) => (
                        <div
                            key={recipe._id}
                            className="border rounded-lg shadow p-4 flex flex-col"
                        >
                            {recipe.imageUrl && (
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="h-40 w-full object-cover rounded mb-4"
                                />
                            )}
                            <h2 className="font-semibold text-xl mb-2">
                                {recipe.title}
                            </h2>
                            <p className="text-sm text-gray-600 flex-1">
                                {recipe.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-auto z-50 p-6">
                    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold">
                                {modalRecipe ? "Edit Recipe" : "Create Recipe"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-800 text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
                            <CreateRecipe
                                recipe={modalRecipe}
                                onDone={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
