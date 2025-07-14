import { useState } from "react";
import axios from "../Components/utils/axios";

export default function CreateRecipe() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        servings: 1,
        prepTime: 0,
        cookTime: 0,
        coolTime: 0,
        category: "",
        image: null,
    });

    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [tags, setTags] = useState([]);
    const [nutrition, setNutrition] = useState({
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
    });
    const [tempInput, setTempInput] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleTempInput = (key, value) => {
        setTempInput({ ...tempInput, [key]: value });
    };

    const handleAddItem = (key, list, setter) => {
        if (tempInput[key]) {
            setter([...list, tempInput[key]]);
            setTempInput({ ...tempInput, [key]: "" });
        }
    };

    const handleRemoveItem = (index, list, setter) => {
        setter(list.filter((_, i) => i !== index));
    };

    const handleNutritionChange = (e) => {
        const { name, value } = e.target;
        setNutrition({ ...nutrition, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (let key in form) {
            data.append(key, form[key]);
        }
        data.append("ingredients", JSON.stringify(ingredients));
        data.append("instructions", JSON.stringify(instructions));
        data.append("tags", JSON.stringify(tags));
        data.append("nutrition", JSON.stringify(nutrition));

        try {
            await axios.post("/recipes", data);
            alert("✅ Recipe created");
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert("❌ Failed to create recipe");
        }
    };

    const renderTagInput = (label, key, list, setter) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="flex gap-2">
                <input
                    value={tempInput[key] || ""}
                    onChange={(e) => handleTempInput(key, e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded"
                    placeholder={`Add ${label.toLowerCase()}...`}
                />
                <button
                    type="button"
                    onClick={() => handleAddItem(key, list, setter)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {list.map((item, index) => (
                    <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={() =>
                                handleRemoveItem(index, list, setter)
                            }
                            className="text-red-500 hover:text-red-700"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mt-10 space-y-5 p-6 bg-white shadow-lg rounded-lg border border-gray-200"
        >
            <h2 className="text-2xl font-bold text-center text-gray-800">
                Create Recipe
            </h2>

            {[
                { label: "Title", name: "title" },
                { label: "Description", name: "description" },
                { label: "Servings", name: "servings", type: "number" },
                { label: "Prep Time (min)", name: "prepTime", type: "number" },
                { label: "Cook Time (min)", name: "cookTime", type: "number" },
                { label: "Cool Time (min)", name: "coolTime", type: "number" },
                { label: "Category", name: "category" },
            ].map(({ label, name, type = "text" }) => (
                <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                    <input
                        type={type}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#469b7e]"
                    />
                </div>
            ))}

            {renderTagInput(
                "Ingredients",
                "ingredients",
                ingredients,
                setIngredients
            )}
            {renderTagInput(
                "Instructions",
                "instructions",
                instructions,
                setInstructions
            )}
            {renderTagInput("Tags", "tags", tags, setTags)}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nutrition
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {["calories", "protein", "carbs", "fats"].map((key) => (
                        <input
                            key={key}
                            type="number"
                            name={key}
                            placeholder={key}
                            value={nutrition[key]}
                            onChange={handleNutritionChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                </label>
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                />
            </div>

            <button
                type="submit"
                className="bg-[#469b7e] hover:bg-[#357662] text-white font-semibold py-2 px-4 rounded w-full"
            >
                Submit Recipe
            </button>
        </form>
    );
}
