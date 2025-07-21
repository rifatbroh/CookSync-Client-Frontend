import { useEffect, useState } from "react";
import axios from "../Components/utils/axios";

const AdminApproveChef = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approveLoadingId, setApproveLoadingId] = useState(null);
    const [rejectLoadingId, setRejectLoadingId] = useState(null);

    // Fetch requests
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/users/admin/chef-requests");
            setRequests(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching chef requests:", err);
            setError("Failed to load chef requests. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Alert + Callback
    const notifyAndUpdate = (message, onUpdate) => {
        alert(message);
        if (typeof onUpdate === "function") {
            onUpdate();
        }
    };

    const approve = async (id) => {
        setApproveLoadingId(id);
        try {
            const res = await axios.patch(`/users/admin/approve-chef/${id}`);
            if (res.status === 200 || res.status === 204) {
                notifyAndUpdate("✅ Chef approved successfully", fetchRequests);
            } else {
                alert("⚠️ Unexpected server response.");
            }
        } catch (err) {
            console.error("Approval error:", err);
            alert("❌ Failed to approve chef. Please try again.");
        } finally {
            setApproveLoadingId(null);
        }
    };

    const reject = async (id) => {
        const confirmReject = window.confirm("Are you sure you want to reject this chef?");
        if (!confirmReject) return;

        setRejectLoadingId(id);
        try {
            const res = await axios.patch(`/users/admin/reject-chef/${id}`);
            if (res.status === 200 || res.status === 204) {
                notifyAndUpdate("✅ Chef request rejected", fetchRequests);
            } else {
                alert("⚠️ Unexpected server response.");
            }
        } catch (err) {
            console.error("Rejection error:", err);
            alert("❌ Failed to reject chef. Please try again.");
        } finally {
            setRejectLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-lg font-medium text-gray-600">
                    Loading pending chef requests...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-50">
                <div className="text-lg font-medium text-red-700">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
                    Pending Chef Applications
                </h1>

                {requests.length === 0 ? (
                    <div className="bg-green-50 text-green-800 border border-green-200 p-6 rounded-lg text-center">
                        <p className="text-xl font-medium">No pending chef requests.</p>
                        <p className="text-sm text-gray-600 mt-2">
                            All applications have been reviewed.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((r) => (
                            <div
                                key={r._id}
                                className="bg-white border p-5 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Email: <span className="font-medium">{r.email}</span>
                                    </p>
                                    {r.bio && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Bio: "{r.bio}"
                                        </p>
                                    )}
                                    {r.experience && (
                                        <p className="text-sm text-gray-600">
                                            Experience: {r.experience} years
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-4 sm:mt-0">
                                    <button
                                        onClick={() => approve(r._id)}
                                        disabled={approveLoadingId === r._id}
                                        className={`px-5 py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition ${
                                            approveLoadingId === r._id ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        {approveLoadingId === r._id ? "Approving..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={() => reject(r._id)}
                                        disabled={rejectLoadingId === r._id}
                                        className={`px-5 py-2 rounded-md text-white font-semibold bg-red-500 hover:bg-red-600 transition ${
                                            rejectLoadingId === r._id ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        {rejectLoadingId === r._id ? "Rejecting..." : "Reject"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminApproveChef;
