import { useEffect, useState } from "react";
import axios from "../../utils/axios"; // Adjust the path to your axios instance

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/users"); // your API endpoint
                setUsers(response.data); // Assuming response.data is an array of users
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
            <h1>This is user panel</h1>

            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <ul>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user._id || user.id}>
                                {user.name ||
                                    user.username ||
                                    user.email ||
                                    "Unnamed User"}
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
