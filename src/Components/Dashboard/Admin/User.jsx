import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";

const USERS_PER_PAGE = 6;

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const currentUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {loading && <p className="text-center">Loading users...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && users.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <p className="text-gray-800">
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`${
                      user.role === "admin"
                        ? "text-red-600 font-bold"
                        : user.role === "chef"
                        ? "text-green-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        !loading && <p className="text-center">No users found.</p>
      )}
    </div>
  );
};

export default User;
