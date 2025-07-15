import { useEffect, useState } from "react";
import axios from "../Components/utils/axios";

export default function AdminApproveChef() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null); // for button loading state

    useEffect(() => {
        axios
            .get("/users/admin/chef-requests")
            .then((res) => {
                setRequests(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch chef requests:", err);
                setError(
                    "Failed to load chef requests. Please try again later."
                );
                setLoading(false);
            });
    }, []);

    const approve = async (id) => {
        setActionLoadingId(id);
        try {
            await axios.patch(`/users/admin/approve-chef/${id}`);
            setRequests((prev) => prev.filter((r) => r._id !== id));
            alert("Chef approved successfully");
        } catch (err) {
            console.error("Failed to approve:", err);
            alert("Failed to approve chef. Please try again.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const reject = async (id) => {
        const confirmReject = window.confirm(
            "Are you sure you want to reject this chef request?"
        );
        if (!confirmReject) return;

        setActionLoadingId(id);
        try {
            await axios.patch(`/users/admin/reject-chef/${id}`);
            setRequests((prev) => prev.filter((r) => r._id !== id));
            alert("Chef request rejected");
        } catch (err) {
            console.error("Failed to reject:", err);
            alert("Failed to reject chef. Please try again.");
        } finally {
            setActionLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-700">
                    Loading pending chef requests...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-50">
                <div className="text-xl font-semibold text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
                    Pending Chef Applications
                </h2>

                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-green-50 rounded-lg border-2 border-green-200">
                        <svg
                            className="w-16 h-16 text-green-500 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <p className="text-xl font-medium text-green-800">
                            No pending chef requests at the moment!
                        </p>
                        <p className="text-gray-600 mt-2">
                            All applications have been reviewed.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((r) => (
                            <div
                                key={r._id}
                                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="mb-3 sm:mb-0">
                                    <p className="text-lg font-semibold text-gray-600">
                                        Email:{" "}
                                        <span className="font-medium">
                                            {r.email}
                                        </span>
                                    </p>
                                    {r.bio && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            Bio: "{r.bio}"
                                        </p>
                                    )}
                                    {r.experience && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Experience: {r.experience} years
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => approve(r._id)}
                                        disabled={actionLoadingId === r._id}
                                        className={`px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                            actionLoadingId === r._id
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {actionLoadingId === r._id
                                            ? "Approving..."
                                            : "Approve Chef"}
                                    </button>
                                    <button
                                        onClick={() => reject(r._id)}
                                        disabled={actionLoadingId === r._id}
                                        className={`px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                            actionLoadingId === r._id
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {actionLoadingId === r._id
                                            ? "Rejecting..."
                                            : "Reject Chef"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
