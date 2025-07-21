import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import UpdatePreferencesForm from "./ProfileSettings";
import RequestChefAccess from "./RequestChefAccess";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);

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

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin border-4 border-t-4 border-gray-500 rounded-full w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 sm:p-4 flex items-center justify-center font-inter">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
            Your Personalized Dashboard
          </h2>

          {/* Profile */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Welcome, {user.email.split("@")[0]}!
              </h3>
              <p className="text-sm text-gray-500">
                Role:{" "}
                <span className="font-medium text-purple-600">{user.role}</span>
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 border-blue-100">
              Dietary Preferences
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Vegan", value: user.preferences.vegan },
                { label: "Vegetarian", value: user.preferences.vegetarian },
                { label: "Nut Allergy", value: user.preferences.nutAllergy },
                { label: "Gluten Free", value: user.preferences.glutenFree },
              ].map(({ label, value }) => (
                <li
                  key={label}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-md border text-gray-700"
                >
                  <span>{label}:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      value
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {value ? "Yes" : "No"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPreferenceModal(true)}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2.5 rounded-full shadow hover:shadow-md text-sm font-medium transition-transform hover:scale-105"
              >
                Update Preferences
              </button>
            </div>
          </div>

          {/* Chef Access */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 border-purple-100">
              Chef Access Request
            </h3>
            <p className="text-sm text-gray-700 text-center mb-4">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`font-semibold ${
                  user.chefRequest.status === "none"
                    ? "text-gray-500"
                    : user.chefRequest.status === "pending"
                    ? "text-yellow-600"
                    : user.chefRequest.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {user.chefRequest.status === "none"
                  ? "No request made"
                  : user.chefRequest.status.charAt(0).toUpperCase() +
                    user.chefRequest.status.slice(1)}
              </span>
            </p>

            {user.chefRequest.status === "none" && (
              <div className="text-center">
                <RequestChefAccess
                  onUpdate={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await axios.get("/users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setUser(res.data);
                    } catch (err) {
                      console.error("Failed to refresh user data", err);
                    }
                  }}
                />
              </div>
            )}

            {user.chefRequest.status === "pending" && (
              <p className="text-yellow-600 text-sm text-center font-medium">
                Your chef access request is pending.
              </p>
            )}

            {user.chefRequest.status === "approved" && (
              <p className="text-green-600 text-sm text-center font-medium">
                Congratulations! Your chef access has been approved.
              </p>
            )}

            {user.chefRequest.status === "rejected" && (
              <p className="text-red-600 text-sm text-center font-medium">
                Your chef access request was rejected.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preference Modal */}
      {showPreferenceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-md relative">
            <button
              onClick={() => setShowPreferenceModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
            >
              ✕
            </button>

            <UpdatePreferencesForm
              onClose={() => setShowPreferenceModal(false)}
              onUpdate={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await axios.get("/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setUser(res.data);
                } catch (err) {
                  console.error("Failed to refresh user data", err);
                } finally {
                  setShowPreferenceModal(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
