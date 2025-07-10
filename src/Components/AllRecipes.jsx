import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        axios.get("/recipes").then((res) => setRecipes(res.data));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {recipes.map((recipe) => (
                <div key={recipe._id} className="bg-white shadow p-4 rounded">
                    <h3 className="font-bold text-lg">{recipe.title}</h3>
                    <p className="text-sm text-gray-500">
                        {recipe.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
