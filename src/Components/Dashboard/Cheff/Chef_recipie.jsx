import { useEffect, useState } from "react";
import axios from "../../utils/axios";

// Function to load user from localStorage
const loadUserFromLocalStorage = () => {
    try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData?._id && userData?.role) {
            return userData; // Return userData if valid
        } else {
            console.error("Invalid user data in localStorage", userData);
            return null;
        }
    } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        return null;
    }
};

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chefId, setChefId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const user = loadUserFromLocalStorage();
        if (user) {
            setChefId(user._id);
            setUserRole(user.role.toLowerCase());
            fetchRecipes(user._id, user.token);
        } else {
            console.log("User or token not found in localStorage.");
            setLoading(false);
        }
    }, []);

    const fetchRecipes = async (chefId, token) => {
        try {
            const res = await axios.get(`/recipes/chef/${chefId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                const formattedRecipes = res.data.map((recipe) => ({
                    ...recipe,
                    nutrition: recipe.nutrition || {
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fats: 0,
                    },
                    ingredients: recipe.ingredients || [],
                    instructions: recipe.instructions || [],
                    imageUrl: recipe.imageUrl || "",
                }));
                setRecipes(formattedRecipes);
            } else {
                console.error(
                    "Failed to fetch recipes with status:",
                    res.status
                );
            }
        } catch (err) {
            console.error("Error fetching chef recipes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRecipe = async (recipeId) => {
        try {
            const updatedRecipe = { title: "Updated Recipe Title" };
            const token = localStorage.getItem("token");

            const res = await axios.put(`/recipes/${recipeId}`, updatedRecipe, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                const updatedRecipes = recipes.map((recipe) =>
                    recipe._id === recipeId
                        ? { ...recipe, ...updatedRecipe }
                        : recipe
                );
                setRecipes(updatedRecipes);
                console.log("Recipe updated successfully:", res.data);
            }
        } catch (err) {
            console.error("Error updating recipe:", err);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.delete(`/recipes/${recipeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                const updatedRecipes = recipes.filter(
                    (recipe) => recipe._id !== recipeId
                );
                setRecipes(updatedRecipes);
                console.log("Recipe deleted successfully:", res.data);
            }
        } catch (err) {
            console.error("Error deleting recipe:", err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                My Recipes
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : recipes.length === 0 ? (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <p className="text-gray-600 text-lg">
                        No recipes available.
                    </p>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200">
                        Create New Recipe
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {recipe.imageUrl && (
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {recipe.title || "Untitled"}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {recipe.description ||
                                        "No description provided"}
                                </p>

                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Ingredients
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        {recipe.ingredients.length > 0 ? (
                                            recipe.ingredients.map(
                                                (ingredient, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-sm"
                                                    >
                                                        {ingredient}
                                                    </li>
                                                )
                                            )
                                        ) : (
                                            <li className="text-sm text-gray-500">
                                                No ingredients listed.
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Nutrition
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="font-medium">
                                                Calories:
                                            </span>{" "}
                                            {recipe.nutrition.calories || "N/A"}
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="font-medium">
                                                Protein:
                                            </span>{" "}
                                            {recipe.nutrition.protein || "N/A"}g
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="font-medium">
                                                Carbs:
                                            </span>{" "}
                                            {recipe.nutrition.carbs || "N/A"}g
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="font-medium">
                                                Fats:
                                            </span>{" "}
                                            {recipe.nutrition.fats || "N/A"}g
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2 mt-4">
                                    <button
                                        onClick={() =>
                                            handleUpdateRecipe(recipe._id)
                                        }
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition duration-200 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteRecipe(recipe._id)
                                        }
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
