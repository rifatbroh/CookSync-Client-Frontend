import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const UpdatePreferencesForm = () => {
    const [preferences, setPreferences] = useState({
        vegan: false,
        vegetarian: false,
        nutAllergy: false,
        glutenFree: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios
            .get("/users/me")
            .then((res) => {
                setPreferences(res.data.preferences);
            })
            .catch((err) => {
                console.error("Failed to fetch preferences:", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setPreferences((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await axios.patch("/users/preferences", preferences);
            setMessage("✅ Preferences updated successfully.");
        } catch (err) {
            console.error("Update failed:", err);
            setMessage("❌ Failed to update preferences.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-8"
        >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Update Dietary Preferences
            </h2>

            <div className="space-y-4">
                {Object.keys(preferences).map((key) => (
                    <label
                        key={key}
                        className="flex items-center gap-2 text-gray-700"
                    >
                        <input
                            type="checkbox"
                            name={key}
                            checked={preferences[key]}
                            onChange={handleChange}
                            className="accent-green-600 h-4 w-4"
                        />
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                ))}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {loading ? "Updating..." : "Save Preferences"}
            </button>

            {message && (
                <p className="mt-4 text-center text-sm font-medium text-gray-700">
                    {message}
                </p>
            )}
        </form>
    );
};

export default UpdatePreferencesForm;
