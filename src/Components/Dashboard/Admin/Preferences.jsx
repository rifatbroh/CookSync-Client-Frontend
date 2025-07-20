import { useEffect, useState } from "react";
import axios from "../../utils/axios"; // Update this path

const Preferences = () => {
    const [preferences, setPreferences] = useState({
        theme: "",
        notifications: false,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Optional: Fetch current preferences on load
    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const res = await axios.get("/preferences");
                setPreferences(res.data.preferences);
            } catch (err) {
                console.error("Error fetching preferences:", err);
            }
        };

        fetchPreferences();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPreferences((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.patch("/preferences", preferences);
            setMessage(res.data.message);
        } catch (err) {
            console.error("Error updating preferences:", err);
            setMessage("Failed to update preferences.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>This is Preferences</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Theme:</label>
                    <select
                        name="theme"
                        value={preferences.theme}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="notifications"
                            checked={preferences.notifications}
                            onChange={handleChange}
                        />
                        Enable Notifications
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Preferences"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Preferences;
