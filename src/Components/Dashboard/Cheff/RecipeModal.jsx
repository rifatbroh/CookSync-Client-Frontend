import { useEffect, useState } from "react";

const RecipeModal = ({ isOpen, onClose, recipe, onSave }) => {
    const [editedRecipe, setEditedRecipe] = useState({
        title: "",
        description: "",
        ingredients: [""],
        nutrition: {
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
        },
    });

    useEffect(() => {
        if (recipe) {
            setEditedRecipe({
                title: recipe.title || "",
                description: recipe.description || "",
                ingredients: recipe.ingredients?.length ? recipe.ingredients : [""],
                nutrition: {
                    calories: recipe.nutrition?.calories || "",
                    protein: recipe.nutrition?.protein || "",
                    carbs: recipe.nutrition?.carbs || "",
                    fats: recipe.nutrition?.fats || "",
                },
                _id: recipe._id,
            });
        }
    }, [recipe]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedRecipe((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNutritionChange = (e) => {
        const { name, value } = e.target;
        setEditedRecipe((prev) => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                [name]: value,
            },
        }));
    };

    const handleIngredientsChange = (index, value) => {
        const updatedIngredients = [...editedRecipe.ingredients];
        updatedIngredients[index] = value;
        setEditedRecipe((prev) => ({
            ...prev,
            ingredients: updatedIngredients,
        }));
    };

    const addIngredient = () => {
        setEditedRecipe((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, ""],
        }));
    };

    const removeIngredient = (index) => {
        const updatedIngredients = [...editedRecipe.ingredients];
        updatedIngredients.splice(index, 1);
        setEditedRecipe((prev) => ({
            ...prev,
            ingredients: updatedIngredients,
        }));
    };

    const handleSave = () => {
        onSave(editedRecipe);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 bg-opacity-50 z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-semibold mb-4">Edit Recipe</h2>

                <input
                    type="text"
                    name="title"
                    value={editedRecipe.title}
                    onChange={handleChange}
                    placeholder="Recipe Title"
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                <textarea
                    name="description"
                    value={editedRecipe.description}
                    onChange={handleChange}
                    placeholder="Recipe Description"
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                <div className="mb-4">
                    <h3 className="font-semibold">Ingredients</h3>
                    {editedRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleIngredientsChange(index, e.target.value)}
                                className="flex-1 border rounded px-3 py-2"
                            />
                            <button
                                onClick={() => removeIngredient(index)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove"
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addIngredient}
                        className="text-sm text-blue-600 hover:underline mt-2"
                    >
                        + Add Ingredient
                    </button>
                </div>

                <div className="mb-4">
                    <h3 className="font-semibold">Nutrition Info</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            name="calories"
                            value={editedRecipe.nutrition.calories}
                            onChange={handleNutritionChange}
                            placeholder="Calories"
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="number"
                            name="protein"
                            value={editedRecipe.nutrition.protein}
                            onChange={handleNutritionChange}
                            placeholder="Protein (g)"
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="number"
                            name="carbs"
                            value={editedRecipe.nutrition.carbs}
                            onChange={handleNutritionChange}
                            placeholder="Carbs (g)"
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="number"
                            name="fats"
                            value={editedRecipe.nutrition.fats}
                            onChange={handleNutritionChange}
                            placeholder="Fats (g)"
                            className="border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
