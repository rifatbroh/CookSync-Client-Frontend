import { useState } from "react";
import axios from "../utils/axios";

export default function CreateRecipe() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        servings: 1,
        prepTime: 0,
        cookTime: 0,
        coolTime: 0,
        category: "",
        ingredients: "",
        instructions: "",
        tags: "",
        nutrition: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (let key in form) {
            data.append(key, form[key]);
        }

        try {
            await axios.post("/recipes", data);
            alert("Recipe created");
        } catch (err) {
            alert("Failed to create recipe");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mt-10 space-y-4 p-4 bg-white shadow rounded"
        >
            <h2 className="text-xl font-bold mb-4">Create Recipe</h2>
            {[
                "title",
                "description",
                "servings",
                "prepTime",
                "cookTime",
                "coolTime",
                "category",
            ].map((field) => (
                <input
                    key={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field}
                    className="w-full border p-2 rounded"
                />
            ))}
            <input
                name="ingredients"
                placeholder="Ingredients (JSON)"
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="instructions"
                placeholder="Instructions (JSON)"
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="tags"
                placeholder="Tags (JSON)"
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="nutrition"
                placeholder="Nutrition (JSON)"
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="image"
                type="file"
                onChange={handleChange}
                className="w-full"
            />
            <button className="bg-green-600 text-white p-2 rounded w-full">
                Submit
            </button>
        </form>
    );
}
