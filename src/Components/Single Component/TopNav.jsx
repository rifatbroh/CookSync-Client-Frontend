import { useEffect, useRef, useState } from "react";
import { FaBell, FaHeart, FaSearch, FaSignOutAlt } from "react-icons/fa";
import axios from "../utils/axios";
import UserFavorites from "../UserFavorites"; // Import UserFavorites component

const TopNav = () => {
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false); // New state for favorites modal

  const notifRef = useRef();
  const avatarRef = useRef();
  const favoritesModalRef = useRef(); // Ref for the favorites modal

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);

    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
      // Close favorites modal if clicking outside
      if (favoritesModalRef.current && !favoritesModalRef.current.contains(e.target)) {
        setShowFavoritesModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notifications");
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.read).length);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [notifOpen]);

  const markAsRead = async (id, link) => {
    try {
      await axios.post(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
      window.location.href = link;
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleFavoritesClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setShowFavoritesModal(true);
  };

  const closeFavoritesModal = () => {
    setShowFavoritesModal(false);
  };

  return (
    <div className="top-nav w-full flex items-center justify-between px-6 py-4 relative z-50 bg-white ">
      <div className="nav-left w-[70%] relative">
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#469b7e]"
        />
      </div>

      <div className="nav-right flex items-center gap-6">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative inline-flex items-center text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <FaBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-[-2px] left-3 bg-red-500 border-2 border-white w-3 h-3 rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white divide-y divide-gray-100 rounded-lg shadow z-50">
              <div className="px-4 py-2 font-medium text-gray-700 bg-gray-50 rounded-t-lg">
                Notifications
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`flex px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                        notif.read ? "opacity-70" : ""
                      }`}
                      onClick={() =>
                        markAsRead(notif._id, notif.link) // Ensure this is uncommented if you want navigation on click
                      }
                    >
                      <div className="w-full ps-3">
                        <div className="text-sm text-gray-700">
                          {notif.message}
                        </div>
                        <div className="text-xs text-blue-600">
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleFavoritesClick} // Use the new handler
          title="My Favorites"
          className="text-gray-600 hover:text-red-500 relative"
        >
          <FaHeart className="w-5 h-5" />
        </button>

        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
          >
            <img
              className="w-8 h-8 rounded-full"
              src="https://i.pinimg.com/736x/3b/f9/7c/3bf97c640b8732a64ab73b653f622582.jpg"
              alt="user"
            />
          </button>

          {avatarOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow z-50">
              <div className="px-4 py-3 text-sm text-gray-900">
                <div>{user?.name}</div>
                <div className="font-medium truncate">{user?.email}</div>
                <div className="text-xs mt-2 text-gray-500 italic">
                  Role: {user?.role || "user"}
                </div>
              </div>

              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* UserFavorites Modal */}
      {showFavoritesModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={closeFavoritesModal} // Close when clicking outside the modal content
        >
          <div
            ref={favoritesModalRef} // Assign ref to the modal content
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
          >
            <button
              onClick={closeFavoritesModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-4xl leading-none"
              aria-label="Close favorites modal"
            >
              &times;
            </button>
            <UserFavorites />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;