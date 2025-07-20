import { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";

const CookingSessionManager = () => {
    const [activeSessions, setActiveSessions] = useState([]);
    const [steps, setSteps] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState("");
    const [message, setMessage] = useState("");
    const [userRole, setUserRole] = useState("");
    const [chefId, setChefId] = useState("");

    const socketRef = useRef(null);

    // Load user info once on mount
    useEffect(() => {
        loadUserFromLocalStorage();
    }, []);

    // When chefId is available, fetch data and setup WS
    useEffect(() => {
        if (chefId) {
            fetchActiveSessions();
            fetchRecipes();
            setupWebSocket();
        }

        // Cleanup WS on unmount or when chefId changes
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [chefId]);

    // Setup WebSocket connection and handlers
    const setupWebSocket = () => {
        if (socketRef.current) return; // Already connected

        const WS_URL = "ws://localhost:5000/ws";
        socketRef.current = new WebSocket(WS_URL);

        socketRef.current.onopen = () => {
            console.log("WebSocket connected");
            // Identify yourself to the server
            socketRef.current.send(
                JSON.stringify({
                    type: "IDENTIFY",
                    userId: chefId,
                    role: userRole,
                })
            );
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "ACTIVE_SESSIONS") {
                    setActiveSessions(data.sessions);
                }

                if (
                    data.type === "NEW_STEP" &&
                    data.sessionId === selectedRecipeId
                ) {
                    setSteps((prev) => [...prev, data.step]);
                }

                // Add more handlers here if needed
            } catch (err) {
                console.error("Error parsing WS message", err);
            }
        };

        socketRef.current.onerror = (err) => {
            console.error("WebSocket error", err);
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket disconnected. Reconnecting in 3 seconds...");
            socketRef.current = null;
            setTimeout(setupWebSocket, 3000); // Attempt reconnect
        };
    };

    const loadUserFromLocalStorage = () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData?._id && userData?.role) {
                setChefId(userData._id);
                setUserRole(userData.role.toLowerCase());
            } else {
                console.error("Invalid user data in localStorage", userData);
            }
        } catch (err) {
            console.error("Failed to parse user from localStorage", err);
        }
    };

    const fetchActiveSessions = async () => {
        try {
            const res = await axios.get("/recipes/active-sessions");
            setActiveSessions(res.data);
        } catch (err) {
            console.error("Error fetching active sessions:", err);
        }
    };

    const fetchRecipes = async () => {
        try {
            const res = await axios.get(`/recipes/chef/${chefId}`);
            setRecipes(res.data);
        } catch (err) {
            console.error("Error fetching chef recipes:", err);
        }
    };

    const startSession = async () => {
        if (!selectedRecipeId) {
            setMessage("⚠️ Please select a recipe.");
            return;
        }

        try {
            await axios.post(`/cooking/${selectedRecipeId}/start-session`);
            setMessage("✅ Session started");
            // activeSessions will update via WebSocket event
        } catch (err) {
            console.error("Error starting session:", err);
            setMessage("❌ Failed to start session");
        }
    };

    const endSession = async (id) => {
        try {
            await axios.post(`/recipes/${id}/end-session`);
            setMessage("✅ Session ended");
            // activeSessions will update via WebSocket event
        } catch (err) {
            console.error("Error ending session:", err);
            setMessage("❌ Failed to end session");
        }
    };

    const fetchSteps = async (id) => {
        try {
            const res = await axios.get(`/cooking/${id}`);
            setSteps(res.data);
            setSelectedRecipeId(id);

            // Tell backend to send live step updates for this session
            if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN
            ) {
                socketRef.current.send(
                    JSON.stringify({ type: "JOIN_SESSION", sessionId: id })
                );
            }
        } catch (err) {
            console.error("Error fetching steps:", err);
        }
    };

    if (!userRole) {
        return (
            <div className="text-center text-gray-600 py-10">
                Loading user info...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
                🍳 Cooking Sessions Manager
            </h2>

            {message && (
                <div className="mb-4 p-3 text-sm rounded bg-blue-100 text-blue-800">
                    {message}
                </div>
            )}

            {/* Active Sessions */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Active Sessions</h3>
                {activeSessions.length === 0 ? (
                    <p className="text-gray-600">No active sessions.</p>
                ) : (
                    <ul className="space-y-3">
                        {activeSessions.map((session) => (
                            <li
                                key={session._id}
                                className="border p-4 rounded shadow-sm bg-white"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                                Recipe ID:
                                            </span>{" "}
                                            {session.recipeId}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                                Started By:
                                            </span>{" "}
                                            {session.userId?.email}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        <button
                                            onClick={() =>
                                                endSession(session.recipeId)
                                            }
                                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                        >
                                            End
                                        </button>
                                        <button
                                            onClick={() =>
                                                fetchSteps(session.recipeId)
                                            }
                                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                        >
                                            View Steps
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Only for chefs */}
            {userRole === "chef" && (
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">
                        Start New Session
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={selectedRecipeId}
                            onChange={(e) =>
                                setSelectedRecipeId(e.target.value)
                            }
                            className="border px-4 py-2 rounded w-full sm:w-auto"
                        >
                            <option value="">Select a recipe</option>
                            {recipes.map((recipe) => (
                                <option key={recipe._id} value={recipe._id}>
                                    {recipe.title || `Recipe ${recipe._id}`}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={startSession}
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                        >
                            Start Session
                        </button>
                    </div>
                </section>
            )}

            {/* Steps Viewer */}
            {steps.length > 0 && (
                <section>
                    <h3 className="text-xl font-semibold mb-2">
                        Steps for Recipe ID: {selectedRecipeId}
                    </h3>
                    <ul className="space-y-2 bg-gray-50 p-4 rounded shadow-inner">
                        {steps.map((step, index) => (
                            <li
                                key={index}
                                className="border-b py-2 text-sm text-gray-700"
                            >
                                <strong>{step.step}</strong> — by {step.by} at{" "}
                                {new Date(step.at).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default CookingSessionManager;
