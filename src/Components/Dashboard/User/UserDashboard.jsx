import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import RequestChefAccess from "./RequestChefAccess";

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const profileRes = await axios.get("/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(profileRes.data);
            } catch (error) {
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin border-4 border-t-4 border-gray-500 rounded-full w-16 h-16"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    User Dashboard
                </h2>
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-700">
                            {user.email[0]}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {user.email}
                        </h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Personal Information
                    </h3>
                    <ul className="space-y-2 mt-4">
                        <li className="flex justify-between text-gray-700">
                            <span className="font-medium">ID:</span>
                            <span>{user._id}</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span className="font-medium">Role:</span>
                            <span>{user.role}</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span className="font-medium">
                                Account Created:
                            </span>
                            <span>
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Dietary Preferences
                    </h3>
                    <ul className="space-y-2 mt-4">
                        <li className="flex justify-between text-gray-700">
                            <span className="font-medium">Vegan:</span>
                            <span>{user.preferences.vegan ? "Yes" : "No"}</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span className="font-medium">Vegetarian:</span>
                            <span>
                                {user.preferences.vegetarian ? "Yes" : "No"}
                            </span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span className="font-medium">Nut Allergy:</span>
                            <span>
                                {user.preferences.nutAllergy ? "Yes" : "No"}
                            </span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span className="font-medium">Gluten Free:</span>
                            <span>
                                {user.preferences.glutenFree ? "Yes" : "No"}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Chef Access Request
                    </h3>
                    <p className="mt-2 text-gray-700">
                        <span className="font-medium">Status:</span>{" "}
                        {user.chefRequest.status === "none"
                            ? "No request made"
                            : user.chefRequest.status}
                    </p>

                    {user.chefRequest.status === "none" && (
                        <div className="mt-4">
                            <RequestChefAccess />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
