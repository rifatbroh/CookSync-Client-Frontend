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
    const [chefId, setChefId] = useState(null); // state to hold the chef ID
    const [userRole, setUserRole] = useState(null); // state to hold the user role

    useEffect(() => {
        const user = loadUserFromLocalStorage(); // Get the user data from localStorage

        if (user) {
            setChefId(user._id);
            setUserRole(user.role.toLowerCase()); // Set chefId and userRole state
            fetchRecipes(user._id, user.token); // Fetch recipes with the user data
        } else {
            console.log("User or token not found in localStorage.");
            setLoading(false);
        }
    }, []); // Empty dependency array to run only once

    // Function to fetch recipes using the chef ID
    const fetchRecipes = async (chefId, token) => {
        try {
            const res = await axios.get(`/recipes/chef/${chefId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("API response:", res.data); // Log the response to check the data

            if (res.status === 200) {
                // Format recipes with default values if missing
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
                setRecipes(formattedRecipes); // Update recipes state
            } else {
                console.error(
                    "Failed to fetch recipes with status:",
                    res.status
                );
            }
        } catch (err) {
            console.error("Error fetching chef recipes:", err);
        } finally {
            setLoading(false); // Set loading to false once the fetch is done
        }
    };

    // Handle recipe update (PUT request)
    const handleUpdateRecipe = async (recipeId) => {
        try {
            const updatedRecipe = { title: "Updated Recipe Title" }; // Example of an updated field
            const token = localStorage.getItem("token"); // Get the token from localStorage

            const res = await axios.put(`/recipes/${recipeId}`, updatedRecipe, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                // Update the recipes list with the updated recipe data
                const updatedRecipes = recipes.map((recipe) =>
                    recipe._id === recipeId
                        ? { ...recipe, ...updatedRecipe }
                        : recipe
                );
                setRecipes(updatedRecipes); // Update the state with the new recipe data
                console.log("Recipe updated successfully:", res.data);
            }
        } catch (err) {
            console.error("Error updating recipe:", err);
        }
    };

    // Handle recipe deletion (DELETE request)
    const handleDeleteRecipe = async (recipeId) => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage

            const res = await axios.delete(`/recipes/${recipeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                // Remove the deleted recipe from the state
                const updatedRecipes = recipes.filter(
                    (recipe) => recipe._id !== recipeId
                );
                setRecipes(updatedRecipes); // Update the state with the remaining recipes
                console.log("Recipe deleted successfully:", res.data);
            }
        } catch (err) {
            console.error("Error deleting recipe:", err);
        }
    };

    console.log("Current recipes state:", recipes);

    return (
        <div>
            <h1>Your Recipes</h1>
            {loading ? (
                <p>Loading...</p>
            ) : recipes.length === 0 ? (
                <p>No recipes available.</p>
            ) : (
                <div>
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="recipe-card">
                            <h2>{recipe.title || "Untitled"}</h2>
                            <p>
                                {recipe.description ||
                                    "No description provided"}
                            </p>

                            {recipe.imageUrl && (
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="recipe-image"
                                    width="200"
                                />
                            )}

                            <div>
                                <h3>Ingredients</h3>
                                <ul>
                                    {recipe.ingredients.length > 0 ? (
                                        recipe.ingredients.map(
                                            (ingredient, index) => (
                                                <li key={index}>
                                                    {ingredient}
                                                </li>
                                            )
                                        )
                                    ) : (
                                        <li>No ingredients listed.</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3>Instructions</h3>
                                {recipe.instructions.length > 0 ? (
                                    <ol>
                                        {recipe.instructions.map(
                                            (step, index) => (
                                                <li key={index}>{step}</li>
                                            )
                                        )}
                                    </ol>
                                ) : (
                                    <p>No instructions provided.</p>
                                )}
                            </div>

                            <div>
                                <h3>Nutrition</h3>
                                <ul>
                                    <li>
                                        Calories:{" "}
                                        {recipe.nutrition.calories || "N/A"}
                                    </li>
                                    <li>
                                        Protein:{" "}
                                        {recipe.nutrition.protein || "N/A"}
                                    </li>
                                    <li>
                                        Carbs: {recipe.nutrition.carbs || "N/A"}
                                    </li>
                                    <li>
                                        Fats: {recipe.nutrition.fats || "N/A"}
                                    </li>
                                </ul>
                            </div>

                            {/* Add buttons for updating and deleting the recipe */}
                            <div>
                                <button
                                    onClick={() =>
                                        handleUpdateRecipe(recipe._id)
                                    }
                                >
                                    Update Recipe
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteRecipe(recipe._id)
                                    }
                                >
                                    Delete Recipe
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
