import { useEffect, useState } from "react";
import { FaCalendarAlt, FaEnvelope, FaUserCircle } from "react-icons/fa";
import axios from "../../utils/axios";

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
                <div className="animate-spin border-4 border-t-4 border-[#469b7e] rounded-full w-16 h-16"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-10">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-[#469b7e]/10 text-[#469b7e] rounded-full flex items-center justify-center text-3xl font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            {user?.email}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Role:{" "}
                            <span className="font-medium text-[#469b7e]">
                                {user?.role}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-4 rounded-xl shadow">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                            Account Details
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <FaEnvelope className="text-[#469b7e]" />
                                <span>{user?.email}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaUserCircle className="text-[#469b7e]" />
                                <span>Role: {user?.role}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[#469b7e]" />
                                <span>
                                    Joined:{" "}
                                    {new Date(
                                        user?.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
