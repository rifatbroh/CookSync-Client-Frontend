import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Login from "../Authentication/Login";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogin]);

  useEffect(() => {
    if (user === null) navigate("/");
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    window.location.reload();
  };

  const handleDashboard = () => {
    if (!user) return;
    setDropdownOpen(false);
    const role = user.role?.toLowerCase();
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "chef") navigate("/chef/dashboard");
    else navigate("/user/dashboard");
  };

  const handleLoginSuccess = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user"));
    setUser(updatedUser);
    setShowLogin(false);
    const role = updatedUser?.role?.toLowerCase();
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "chef") navigate("/chef/dashboard");
    else navigate("/user/dashboard");
  };

  return (
    <>
      <header
        className={`w-full px-10 mt-3 py-4 flex items-center justify-between fixed top-0 left-0 z-50 ${
          showLogin ? "backdrop-blur-sm" : ""
        }`}
      >
        {/* Logo */}
        <Logo />

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-white font-medium hover:text-lime-400 transition duration-300">
            Home
          </a>
          <a href="#" className="text-white font-medium hover:text-lime-400 transition duration-300">
            Favourite
          </a>
          <a href="#" className="text-white font-medium hover:text-lime-400 transition duration-300">
            About Us
          </a>
        </nav>

        {/* Auth */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-2 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-black transition duration-300"
            >
              Get Started
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.profileImage || "https://i.pinimg.com/736x/3b/f9/7c/3bf97c640b8732a64ab73b653f622582.jpg"}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white hover:scale-105 transition-transform duration-200"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={handleDashboard}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          navigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Header;
