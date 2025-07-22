import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaHeart,
  FaSearch,
  FaSignOutAlt,
  FaClock,
  FaUtensils,
  FaRegHeart,
  FaThumbsUp,
} from "react-icons/fa";
import axios from "../utils/axios";
import UserFavorites from "../UserFavorites";

const TopNav = () => {
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  // New states for recipe modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [recipeError, setRecipeError] = useState(null);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const notifRef = useRef();
  const avatarRef = useRef();
  const favoritesModalRef = useRef();
  const modalRef = useRef();

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
      if (favoritesModalRef.current && !favoritesModalRef.current.contains(e.target)) {
        setShowFavoritesModal(false);
      }
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
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

  // Fetch recipe by ID for modal display
  const fetchRecipeById = async (id) => {
    setLoadingRecipe(true);
    setRecipeError(null);
    try {
      const res = await axios.get(`/recipes/${id}`);
      setSelectedRecipe(res.data);

      // Comments could come with recipe or fetched separately
      setComments(res.data.comments || []);

      // Check if current user has favorited the recipe (adjust per your API)
      setIsFavorite(
        res.data.likes?.some((likeUserId) => likeUserId === user?._id) || false
      );
    } catch (err) {
      console.error("Failed to fetch recipe", err);
      setRecipeError("Failed to load recipe details.");
      setSelectedRecipe(null);
      setComments([]);
    } finally {
      setLoadingRecipe(false);
    }
  };

  // When user clicks a notification:
  const markAsReadAndOpenModal = async (id, link) => {
    try {
      await axios.post(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

      const recipeId = link.split("/").pop();
      await fetchRecipeById(recipeId);
      setShowModal(true);
      setNotifOpen(false);
    } catch (err) {
      console.error("Failed to mark notification as read or fetch recipe", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
    setComments([]);
    setComment("");
    setRecipeError(null);
  };

  // Favorite toggle logic
  const toggleFavorite = async () => {
    if (!selectedRecipe) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Remove favorite
        await axios.post(`/recipes/${selectedRecipe._id}/unfavorite`);
        setIsFavorite(false);
      } else {
        // Add favorite
        await axios.post(`/recipes/${selectedRecipe._id}/favorite`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Like button handler
  const handleLike = async () => {
    if (!selectedRecipe) return;
    try {
      await axios.post(`/recipes/${selectedRecipe._id}/like`);
      // For simplicity, increase like count locally
      setSelectedRecipe((prev) => ({
        ...prev,
        likes: [...(prev.likes || []), user._id],
      }));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(`/recipes/${selectedRecipe._id}/comments`, {
        text: comment.trim(),
      });
      setComments((prev) => [...prev, res.data]);
      setComment("");
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    setShowFavoritesModal(true);
  };
  const closeFavoritesModal = () => setShowFavoritesModal(false);

  return (
    <div className="top-nav w-full flex items-center justify-between px-6 py-4 relative z-50 bg-white ">
      {/* Left search */}
      <div className="nav-left w-[70%] relative">
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#469b7e]"
        />
      </div>

      {/* Right icons */}
      <div className="nav-right flex items-center gap-6">
        {/* Notifications */}
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
                        markAsReadAndOpenModal(notif._id, notif.link)
                      }
                    >
                      <div className="w-full ps-3">
                        <div className="text-sm text-gray-700">{notif.message}</div>
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

        {/* Favorites */}
        <button
          onClick={handleFavoritesClick}
          title="My Favorites"
          className="text-gray-600 hover:text-red-500 relative"
        >
          <FaHeart className="w-5 h-5" />
        </button>

        {/* User Avatar */}
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
          onClick={closeFavoritesModal}
        >
          <div
            ref={favoritesModalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
            onClick={(e) => e.stopPropagation()}
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

      {/* Full Recipe Detail Modal */}
      {showModal && selectedRecipe && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="bg-white max-w-5xl w-full max-h-[90vh] rounded-2xl relative shadow-2xl overflow-hidden transform scale-95 animate-scaleUp flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl transition-transform duration-200 transform hover:rotate-90 z-10"
            >
              &times;
            </button>

            {/* Left Section (Image and small details) */}
            <div className="w-full md:w-2/5 p-6 bg-gray-50 flex flex-col items-center justify-center rounded-l-2xl">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                className="w-full max-h-96 object-contain rounded-xl mb-6 shadow-md"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedRecipe.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedRecipe.description.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaClock className="text-[#469b7e]" />
                    {selectedRecipe.totalTime} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUtensils className="text-[#469b7e]" />
                    {selectedRecipe.servings} servings
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-600 flex items-center justify-center gap-1">
                  <FaHeart className="text-red-500" />
                  {(selectedRecipe.likes?.length) || 0} likes
                </div>
                <div className="flex justify-center flex-wrap gap-2 mt-4">
                  {selectedRecipe.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[#469b7e]/10 text-[#469b7e] px-3 py-1 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section (Full Details and Interactions) */}
            <div className="mt-4 w-full md:w-3/5 p-8 flex flex-col overflow-y-auto custom-scrollbar">
              <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
                {selectedRecipe.title}
              </h2>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedRecipe.description}
              </p>

              <div className="text-base text-gray-800 space-y-6 mb-8">
                <div>
                  <strong className="block text-2xl font-semibold mb-3 border-b pb-2">
                    Ingredients
                  </strong>
                  <ul className="list-disc list-inside pl-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedRecipe.ingredients.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="block text-2xl font-semibold mb-3 border-b pb-2">
                    Instructions
                  </strong>
                  <ol className="list-decimal list-inside pl-4 space-y-2">
                    {selectedRecipe.instructions.map((step, index) => (
                      <li key={index} className="text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 mb-1">
                    <strong className="text-gray-800">Preparation Time:</strong>{" "}
                    {selectedRecipe.prepTime} mins
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-800">Cook Time:</strong>{" "}
                    {selectedRecipe.cookTime} mins
                  </p>
                </div>
                {selectedRecipe.nutrition && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 mb-1">
                      <strong className="text-gray-800">Calories:</strong>{" "}
                      {selectedRecipe.nutrition.calories || "N/A"} kcal
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong className="text-gray-800">Protein:</strong>{" "}
                      {selectedRecipe.nutrition.protein || "N/A"} g
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong className="text-gray-800">Carbs:</strong>{" "}
                      {selectedRecipe.nutrition.carbs || "N/A"} g
                    </p>
                    <p className="text-gray-700">
                      <strong className="text-gray-800">Fats:</strong>{" "}
                      {selectedRecipe.nutrition.fats || "N/A"} g
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 ${
                    isFavorite
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-[#469b7e] text-white hover:bg-[#377f66]"
                  } ${favoriteLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {isFavorite ? (
                    <FaHeart className="text-white" />
                  ) : (
                    <FaRegHeart className="text-white" />
                  )}
                  {isFavorite ? "Remove" : "Add"}
                </button>

                <button
                  onClick={handleLike}
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FaThumbsUp /> Like
                </button>
              </div>

              <div className="mt-6 border-t pt-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Comments ({comments.length})
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar mb-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c._id}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                      >
                        <span className="text-gray-800 text-sm flex-grow pr-4">
                          <strong className="text-gray-900">
                            {c.user?.name || c.user?.email || "Anonymous"}:
                          </strong>{" "}
                          {c.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border border-gray-300 focus:border-[#469b7e] focus:ring-1 focus:ring-[#469b7e] px-4 py-2 rounded-lg text-gray-700 transition-all duration-200"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-[#469b7e] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#377f66] transition-colors duration-200"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingRecipe && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-white font-bold text-xl">
          Loading recipe...
        </div>
      )}

      {recipeError && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-red-500 font-bold text-xl">
          {recipeError}
          <button
            onClick={() => setRecipeError(null)}
            className="ml-4 underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TopNav;
