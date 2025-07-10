import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function AdminApproveChef() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios
            .get("/users/admin/chef-requests")
            .then((res) => setRequests(res.data));
    }, []);

    const approve = async (id) => {
        await axios.patch(`/users/admin/approve-chef/${id}`);
        setRequests(requests.filter((r) => r._id !== id));
    };

    return (
        <div className="p-4">
            {requests.map((r) => (
                <div key={r._id} className="bg-gray-100 p-4 rounded mb-2">
                    <p>{r.email}</p>
                    <button
                        onClick={() => approve(r._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mt-1"
                    >
                        Approve
                    </button>
                </div>
            ))}
        </div>
    );
}
