import { Heart, HeartOff } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { ToggleFavorite } from "./ToggleFavorite";

const RecipeCard = ({ recipe }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!recipe?._id) return;

        const fetchFavorites = async () => {
            try {
                const res = await axios.get("/users/favorites");
                const isFav = res.data.some((fav) => fav._id === recipe._id);
                setIsFavorite(isFav);
            } catch (err) {
                console.error("Error fetching favorites:", err.message);
            }
        };

        fetchFavorites();
    }, [recipe?._id]);

    const handleToggle = async () => {
        if (!recipe?._id) return;

        setLoading(true);
        try {
            await ToggleFavorite(recipe._id);
            setIsFavorite((prev) => !prev);
        } catch (err) {
            console.error("Toggle failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!recipe) {
        return (
            <div className="p-4 text-red-500 font-medium">
                ⚠️ Invalid recipe data
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden transition hover:shadow-xl">
            <img
                src={recipe.image || "/placeholder.jpg"}
                alt={recipe.title || "Recipe"}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {recipe.title || "Untitled Recipe"}
                    </h2>
                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className={`text-red-500 transition ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-110"
                        }`}
                    >
                        {isFavorite ? (
                            <Heart fill="currentColor" />
                        ) : (
                            <HeartOff />
                        )}
                    </button>
                </div>

                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`w-full mt-2 px-4 py-2 rounded-lg font-medium transition ${
                        isFavorite
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-500 text-white hover:bg-green-600"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
