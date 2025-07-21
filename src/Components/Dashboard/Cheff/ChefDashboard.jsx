import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaEnvelope, FaUserCircle, FaSpinner } from "react-icons/fa"; // Added FaSpinner for loading
import axios from "../../utils/axios"; // Assuming this path is correct
import { Link } from "react-router-dom";


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
                console.error("Failed to fetch user data:", error); // Log full error for debugging
                setError("Failed to load user profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Loading State UI
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
                <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl animate-pulse">
                    <FaSpinner className="animate-spin text-[#469b7e] text-6xl mb-4" />
                    <p className="text-xl font-semibold text-gray-700">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // Error State UI
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-200 p-6">
                <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl text-red-600">
                    <p className="text-xl font-semibold mb-4">Oops! Something went wrong.</p>
                    <p className="text-lg">{error}</p>
                    <p className="text-sm mt-2 text-gray-500">Please refresh the page or try again later.</p>
                </div>
            </div>
        );
    }

    // Main Dashboard UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] to-[#c8e6c9] p-6 sm:p-8 lg:p-12 font-inter">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                {/* Header Section with User Info */}
                <div className="relative p-8 sm:p-10 bg-gradient-to-r from-[#469b7e] to-[#66bb6a] text-white flex flex-col sm:flex-row items-center justify-between rounded-t-3xl">
                    {/* Background overlay for subtle texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="flex items-center space-x-6 z-10">
                        {/* User Avatar/Initial */}
                        <div className="w-24 h-24 bg-white text-[#469b7e] rounded-full flex items-center justify-center text-5xl font-extrabold shadow-lg border-4 border-white transform transition-transform duration-300 hover:scale-105">
                            {user?.email?.charAt(0).toUpperCase() || <FaUserCircle className="text-gray-400 text-6xl" />}
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-1 drop-shadow-md">
                                Welcome, {user?.email?.split('@')[0] || "User"}!
                            </h1>
                            <p className="text-lg sm:text-xl font-light opacity-90">
                                Your Culinary Dashboard
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 sm:mt-0 text-right z-10">
                        <p className="text-sm sm:text-base font-medium opacity-90">
                            Role: <span className="font-semibold">{user?.role || "Guest"}</span>
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8 sm:p-10 lg:p-12">
                    {/* Account Details Card */}
                    <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-inner border border-gray-100 mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaUserCircle className="text-[#469b7e] mr-3 text-3xl" />
                            Account Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-lg text-gray-700">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-[#469b7e] text-xl" />
                                <span className="font-medium">Email:</span> {user?.email}
                            </div>
                            <div className="flex items-center gap-3">
                                <FaUserCircle className="text-[#469b7e] text-xl" />
                                <span className="font-medium">Role:</span> {user?.role}
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-[#469b7e] text-xl" />
                                <span className="font-medium">Joined:</span>{" "}
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </div>
                            {/* Add more user details here if available, e.g., name, last login */}
                            {user?.lastLogin && (
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-[#469b7e] text-xl" />
                                    <span className="font-medium">Last Login:</span>{" "}
                                    {new Date(user.lastLogin).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Placeholder for other user-specific content or actions */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-lg mb-4">
                            Explore your recipes, manage preferences, and more!
                        </p>
                        {/* Example of a call to action button */}
                         <Link
                            to={`/chef/recipe`}
                                className="inline-block bg-[#469b7e] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#377f66] transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            Go to My Recipes
                        </Link>                   
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
