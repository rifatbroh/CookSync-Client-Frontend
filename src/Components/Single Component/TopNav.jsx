import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaSearch, FaSignOutAlt, FaHeart } from 'react-icons/fa';

const TopNav = () => {
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const notifRef = useRef();
  const avatarRef = useRef();

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; // redirect to login
  };

  return (
    <div className="top-nav w-full flex items-center justify-between px-6 py-4 relative z-50 bg-white ">
      
      {/* SearchBar */}
      <div className="nav-left w-[70%] relative">
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#469b7e]"
        />
      </div>

      {/* Right Section */}
      <div className="nav-right flex items-center gap-6">

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative inline-flex items-center text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute top-[-2px] left-3 bg-red-500 border-2 border-white w-3 h-3 rounded-full"></span>
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white divide-y divide-gray-100 rounded-lg shadow z-50">
              <div className="px-4 py-2 font-medium text-gray-700 bg-gray-50 rounded-t-lg">
                Notifications
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                <a href="#" className="flex px-4 py-3 hover:bg-gray-100">
                  <div className="shrink-0 relative">
                    <img
                      className="rounded-full w-11 h-11"
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="user"
                    />
                    <div className="absolute w-5 h-5 bg-blue-600 border border-white rounded-full -top-2 left-7 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 18 18">
                        <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z"/>
                        <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="w-full ps-3">
                    <div className="text-sm text-gray-500">
                      New message from <span className="font-semibold text-gray-900">Amina</span>
                    </div>
                    <div className="text-xs text-blue-600">Just now</div>
                  </div>
                </a>
              </div>
              <a
                href="/notifications"
                className="block py-2 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-b-lg"
              >
                View all
              </a>
            </div>
          )}
        </div>

        {/* Favorites Badge */}
        <a href="/profile#favorites" title="My Favorites" className="text-gray-600 hover:text-red-500 relative">
          <FaHeart className="w-5 h-5" />
        </a>

        {/* User Dropdown */}
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
                <div>{user?.name || "Guest User"}</div>
                <div className="font-medium truncate">{user?.email}</div>
                <div className="text-xs text-gray-500 italic">Role: {user?.role || "user"}</div>
              </div>
              <ul className="py-2 text-sm text-gray-700">
                <li><a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a></li>
                <li><a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a></li>
                <li><a href="/notifications" className="block px-4 py-2 hover:bg-gray-100">Notifications</a></li>
              </ul>
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
    </div>
  );
};

export default TopNav;
