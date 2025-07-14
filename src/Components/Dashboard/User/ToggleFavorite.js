// src/api/ToggleFavorite.js
import axios from "../../utils/axios";

export const ToggleFavorite = async (recipeId) => {
    try {
        const response = await axios.post(`/users/favorites/${recipeId}`);
        return response.data;
    } catch (err) {
        console.error(
            "❌ Favorite toggle failed:",
            err.response?.data || err.message
        );
        throw err;
    }
};
