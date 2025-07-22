import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import RecipeModal from "./RecipeModal";

const loadUserFromLocalStorage = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?._id && userData?.role) {
      return userData;
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
  }
  return null;
};

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = loadUserFromLocalStorage();
    if (user) {
      fetchRecipes(user._id, user.token);
    } else {
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
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
          },
          ingredients: recipe.ingredients || [""],
          instructions: recipe.instructions || [],
          imageUrl: recipe.imageUrl || "",
        }));
        setRecipes(formattedRecipes);
      }
    } catch (err) {
      console.error("Error fetching chef recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecipe = (recipeId) => {
    const recipeToEdit = recipes.find((r) => r._id === recipeId);
    setSelectedRecipe(recipeToEdit);
    setIsModalOpen(true);
  };

  const handleSaveRecipe = async (updatedRecipe) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/recipes/${updatedRecipe._id}`, updatedRecipe, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const updatedRecipes = recipes.map((r) =>
          r._id === updatedRecipe._id ? updatedRecipe : r
        );
        setRecipes(updatedRecipes);
        setIsModalOpen(false);
        setSelectedRecipe(null);
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
        setRecipes(recipes.filter((r) => r._id !== recipeId));
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-10 shadow-md text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
            alt="No Recipes"
            className="w-20 mb-4 opacity-70"
          />
          <p className="text-xl text-gray-600 font-medium">You haven’t added any recipes yet.</p>
          <p className="text-sm text-gray-400">Start creating your culinary magic today!</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            >
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
                </div>

                {recipe.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">{recipe.description}</p>
                )}

                {/* Ingredients as pill tags */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">🧂 Ingredients:</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((item, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nutrition Stats */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">💪 Nutrition Info:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div className="bg-gray-100 px-3 py-2 rounded shadow-sm">Calories: <span className="font-semibold">{recipe.nutrition.calories}</span></div>
                    <div className="bg-gray-100 px-3 py-2 rounded shadow-sm">Protein: <span className="font-semibold">{recipe.nutrition.protein}g</span></div>
                    <div className="bg-gray-100 px-3 py-2 rounded shadow-sm">Carbs: <span className="font-semibold">{recipe.nutrition.carbs}g</span></div>
                    <div className="bg-gray-100 px-3 py-2 rounded shadow-sm">Fats: <span className="font-semibold">{recipe.nutrition.fats}g</span></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleUpdateRecipe(recipe._id)}
                    className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Modal for Editing */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecipe(null);
        }}
        recipe={selectedRecipe}
        onSave={handleSaveRecipe}
      />
    </div>
  );
}
