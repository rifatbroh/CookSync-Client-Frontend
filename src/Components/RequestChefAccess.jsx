import { useState } from "react";
import axios from "../utils/axios";

export default function RequestChefAccess() {
    const [loading, setLoading] = useState(false);

    const request = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/users/request-chef");
            alert(res.data.message);
        } catch (err) {
            alert(err?.response?.data?.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={request}
            disabled={loading}
            className={`bg-purple-600 text-white p-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {loading ? "Requesting..." : "Request Chef Access"}
        </button>
    );
}
