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

  // This useEffect runs once on mount and when dropdownOpen changes (for click outside)
  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user"); // Clear potentially corrupt data
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser(); // Initial fetch

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Empty dependency array means it runs once on mount

  // This useEffect will specifically listen for changes in user state
  // and trigger redirection if user becomes null (e.g., after logout)
  useEffect(() => {
    // If the user logs out (user becomes null), navigate to the home page
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]); // Depend on user and navigate

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); // This will trigger the useEffect above to navigate to "/"
    setDropdownOpen(false);
    // window.location.reload(); // You can keep this if you prefer a full page reload on logout
  };

  const handleDashboard = () => {
    if (!user) return;
    setDropdownOpen(false); // Close dropdown after clicking dashboard
    if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "cheff") navigate("/chef/dashboard");
    else navigate("/user/dashboard");
  };

  // This function is called ONLY on successful login from the Login component
  const handleLoginSuccess = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user"));
    setUser(updatedUser); // Update user state in Header
    setShowLogin(false); // Close the login modal
    navigate("/"); // *** Redirect to the home page after successful login ***
  };

  return (
    <>
      <div className={`header ${showLogin ? "backdrop-blur-sm" : ""}`}>
        <header className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-200 bg-white relative z-40">
          <Logo />

          <nav className="flex space-x-6">
            <a href="#" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">Home</a>
            <a href="#" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">Favourite</a>
            <a href="#" className="text-gray-800 font-semibold text-sm hover:text-green-700 transition">About us</a>
          </nav>

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

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)} // Simply close the modal
          navigate={navigate} // Still pass navigate if needed elsewhere in Login
          onLoginSuccess={handleLoginSuccess} // This now navigates to "/"
        />
      )}
    </>
  );
};

export default Header;