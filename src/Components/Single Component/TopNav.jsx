import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';


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

  return (
    <div className="top-nav w-full flex items-center justify-between px-6 py-4 relative z-50">
      
      {/* Search Section */}
      <div className="nav-left w-[80%] relative">
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search something..."
          className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#469b7e]"
        />
      </div>

      {/* Profile & Notification */}
      <div className="nav-right flex items-center gap-6">

        {/* Notification Button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative inline-flex items-center text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute top-[-2px] left-3 bg-red-500 border-2 border-white w-3 h-3 rounded-full"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700 z-50">
              <div className="px-4 py-2 font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                Notifications
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-64 overflow-y-auto">
                {/* Example Notification */}
                <a href="#" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
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
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      New message from <span className="font-semibold text-gray-900 dark:text-white">Amina</span>: “Hey doctor, I need an urgent appointment.”
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-500">Just now</div>
                  </div>
                </a>
                {/* Add more notifications here */}
              </div>
              <a
                href="#"
                className="block py-2 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white rounded-b-lg"
              >
                View all
              </a>
            </div>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            type="button"
            aria-haspopup="true"
            aria-expanded={avatarOpen}
            aria-label="Open user menu"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://i.pinimg.com/736x/3b/f9/7c/3bf97c640b8732a64ab73b653f622582.jpg"
              alt="user photo"
            />
          </button>

          {avatarOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 z-50">
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>{user?.name || "Guest User"}</div>
                <div className="font-medium truncate">{user?.email || "email@example.com"}</div>
              </div>
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownUserAvatarButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
               
              </ul>
              <div className="py-2">
             
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TopNav;
