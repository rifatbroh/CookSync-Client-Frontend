import { useEffect, useState } from "react";
import axios from "../Components/utils/axios";

export default function AdminApproveChef() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios
            .get("/users/admin/chef-requests")
            .then((res) => setRequests(res.data))
            .catch((err) => console.error(err));
    }, []);

    const approve = async (id) => {
        try {
            await axios.patch(`/users/admin/approve-chef/${id}`);
            setRequests((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            console.error("Failed to approve:", err);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Pending Chef Requests</h2>
            {requests.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                requests.map((r) => (
                    <div
                        key={r._id}
                        className="bg-gray-100 p-4 rounded mb-2 shadow"
                    >
                        <p>
                            <strong>Email:</strong> {r.email}
                        </p>
                        <button
                            onClick={() => approve(r._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded mt-2 hover:bg-green-600 transition"
                        >
                            Approve
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
