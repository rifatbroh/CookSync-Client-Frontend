import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import RecipeCard from "./RecipeCard";

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const res = await axios.get("/recipes");
            setRecipes(res.data);
        };
        fetchRecipes();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
        </div>
    );
};

export default AllRecipes;
