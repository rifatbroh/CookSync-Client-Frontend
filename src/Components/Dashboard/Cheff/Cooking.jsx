import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "../../utils/axios";
import CookingSessionComponent from "./CookingSessionComponent";

const Cooking = () => {
    const [activeSessions, setActiveSessions] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState("");
    const [message, setMessage] = useState("");
    const [userRole, setUserRole] = useState("");
    const [chefId, setChefId] = useState("");
    const [connected, setConnected] = useState(false); // Track socket connection

    const socketRef = useRef(null);

    useEffect(() => {
        loadUserFromLocalStorage();
    }, []);

    useEffect(() => {
        if (chefId) {
            fetchActiveSessions();
            fetchRecipes();
            setupSocketIO();
        }

        return () => {
            if (socketRef.current) {
                console.log("Disconnecting socket...");
                socketRef.current.disconnect();
                socketRef.current = null;
                setConnected(false);
            }
        };
    }, [chefId]);

    const setupSocketIO = () => {
        if (socketRef.current) {
            console.log("Socket already initialized.");
            return;
        }

        const SOCKET_URL =
            process.env.NODE_ENV === "production"
                ? "https://your-production-url"
                : "http://localhost:5000";

        const token = localStorage.getItem("token");

        console.log("Initializing socket with token:", token);

        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
            auth: {},
            Authorization: {
                token: token ? `Bearer ${token}` : "",
            },
        });

        socket.on("connect", () => {
            console.log("Socket.IO connected:", socket.id);
            setConnected(true);
            socket.emit("IDENTIFY", { userId: chefId, role: userRole });
        });

        socket.on("disconnect", (reason) => {
            console.warn("Socket.IO disconnected:", reason);
            setConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket.IO connection error:", err);
            setConnected(false);
        });

        socket.on("ACTIVE_SESSIONS", (data) => {
            console.log("Received ACTIVE_SESSIONS:", data);
            setActiveSessions(data.sessions);
        });

        socketRef.current = socket;
    };

    const loadUserFromLocalStorage = () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData?._id && userData?.role) {
                setChefId(userData._id);
                setUserRole(userData.role.toLowerCase());
                console.log("Loaded user from localStorage:", userData);
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
            console.log("Fetched active sessions:", res.data);
            setActiveSessions(res.data);
        } catch (err) {
            console.error("Error fetching active sessions:", err);
        }
    };

    const fetchRecipes = async () => {
        try {
            const res = await axios.get(`/recipes/chef/${chefId}`);
            console.log("Fetched recipes for chef:", res.data);
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
            fetchActiveSessions();
        } catch (err) {
            console.error("Error starting session:", err);
            setMessage("❌ Failed to start session");
        }
    };

    const endSession = async (id) => {
        try {
            await axios.post(`/recipes/${id}/end-session`);
            setMessage("✅ Session ended");
            fetchActiveSessions();
        } catch (err) {
            console.error("Error ending session:", err);
            setMessage("❌ Failed to end session");
        }
    };

    const handleViewSteps = (recipeId) => {
        setSelectedRecipeId(recipeId);
    };

    const getRecipeChefIdById = (recipeId) => {
        const recipe = activeSessions.find((r) => r._id === recipeId);
        return recipe?.chefId?._id || recipe?.chefId || "";
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
                        {activeSessions.map((recipe) => (
                            <li
                                key={recipe._id}
                                className="border p-4 rounded shadow-sm bg-white"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                                Title:
                                            </span>{" "}
                                            {recipe.title}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">
                                                Started By:
                                            </span>{" "}
                                            {recipe.chefId?.email || "Unknown"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        <button
                                            onClick={() =>
                                                endSession(recipe._id)
                                            }
                                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                        >
                                            End
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleViewSteps(recipe._id)
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

            {/* Start New Session (Chef only) */}
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

            {/* Live Steps Viewer */}
            {selectedRecipeId && (
                <div className="mt-8">
                    <CookingSessionComponent
                        recipeId={selectedRecipeId}
                        socketRef={socketRef}
                        userId={chefId}
                        chefId={getRecipeChefIdById(selectedRecipeId)}
                        connected={connected} // pass down connection status
                    />
                </div>
            )}
        </div>
    );
};

export default Cooking;
