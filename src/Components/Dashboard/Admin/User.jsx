import axios from "axios";
import { useEffect, useState } from "react";

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/users/admin/users",
                    {
                        headers: {
                            Authorization: "Bearer YOUR_ADMIN_TOKEN",
                            "Content-Type": "application/json",
                        },
                    }
                );
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
        <div>
            <h1>User Panel</h1>
            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <ul>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user._id}>
                                <p>Email: {user.email}</p>
                                <p>Role: {user.role}</p>
                                <p>
                                    Chef Request Status:{" "}
                                    {user.chefRequest.status}
                                </p>
                                <p>
                                    Submitted At:{" "}
                                    {new Date(
                                        user.chefRequest.submittedAt
                                    ).toLocaleString()}
                                </p>
                                <p>
                                    Preferences:{" "}
                                    {JSON.stringify(user.preferences)}
                                </p>
                                <p>Favorites: {user.favorites.join(", ")}</p>
                                <p>
                                    Created At:{" "}
                                    {new Date(user.createdAt).toLocaleString()}
                                </p>
                                <p>
                                    Updated At:{" "}
                                    {new Date(user.updatedAt).toLocaleString()}
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
