import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios"; // adjust the path accordingly

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get("/users/admin/users");
                setUsers(response.data);
            } catch (err) {
                setError("Failed to fetch users");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Panel</h1>
            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <ul>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li
                                key={user._id}
                                className="mb-4 border p-3 rounded"
                            >
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p>
                                    <strong>Role:</strong>{" "}
                                    <span
                                        className={
                                            user.role === "admin"
                                                ? "text-red-600 font-bold"
                                                : user.role === "chef"
                                                ? "text-green-600 font-semibold"
                                                : "text-gray-700"
                                        }
                                    >
                                        {user.role}
                                    </span>
                                </p>
                            </li>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default User;
