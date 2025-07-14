import axios from "../Components/utils/axios";

export const ToggleFavorite = async (recipeId) => {
    try {
        const response = await axios.post(`/users/favorites/${recipeId}`);
        return response.data; // Return success data if needed
    } catch (err) {
        console.error(
            "❌ Favorite toggle failed:",
            err.response?.data || err.message
        );
        throw err; // Optional: rethrow if caller needs to handle it
    }
};
