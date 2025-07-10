import axios from "../utils/axios";

export const toggleFavorite = async (recipeId) => {
    try {
        await axios.post(`/users/favorites/${recipeId}`);
    } catch (err) {
        console.error("Favorite toggle failed", err);
    }
};
