// Header.jsx
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

  // Load user from localStorage
  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogin]); // Refetch user on login modal toggle

  // Redirect to home after logout
  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    window.location.reload(); // Optional: reload to reset state
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
      <div className={`header ${showLogin ? "backdrop-blur-sm" : ""}`}>
        <header className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-200 bg-white relative z-40">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">Home</a>
            <a href="#" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">Favourite</a>
            <a href="#" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">About us</a>
          </nav>

          {/* Right Side (Login/Profile) */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <button
                onClick={() => setShowLogin(true)}
                className="cursor-pointer px-4 py-2 border-2 border-[#0d542b] text-black font-semibold rounded hover:bg-green-800 hover:text-white transition duration-300"
              >
                Get Started
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.profileImage || "https://i.pinimg.com/736x/3b/f9/7c/3bf97c640b8732a64ab73b653f622582.jpg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                    <button
                      onClick={handleDashboard}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Login Modal */}
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
  