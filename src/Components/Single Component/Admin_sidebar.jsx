import { useEffect, useState } from "react";
import {
    FaBars,
    FaHeart,
    FaSignOutAlt,
    FaTachometerAlt,
    FaTimes,
    FaUser,
    FaUserMd,
    FaUsers,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";

const Admin_Sidebar = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.name) {
            setUserName(user.name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const renderMenuItems = () => {
        const currentPath = location.pathname;

        switch (role) {
            case "admin":
                return (
                    <>
                        <MenuItem
                            icon={<FaTachometerAlt />}
                            label="Dashboard"
                            to="/admin/dashboard"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaUserMd />}
                            label="Recipe"
                            to="/admin/recipie"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaUsers />}
                            label="Users"
                            to="/admin/user"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaUsers />}
                            label="Preferences"
                            to="/admin/preferences"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                    </>
                );

            case "cheff":
                return (
                    <>
                        <MenuItem
                            icon={<FaTachometerAlt />}
                            label="Dashboard"
                            to="/chef/dashboard"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaUserMd />}
                            label="Cooking"
                            to="/chef/cooking"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaUsers />}
                            label="Recipe"
                            to="/chef/recipe"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                    </>
                );

            case "user":
                return (
                    <>
                        <MenuItem
                            icon={<FaTachometerAlt />}
                            label="Dashboard"
                            to="/user/dashboard"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaUser />}
                            label="Profile"
                            to="/user/chat"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaHeart />}
                            label="My Favorites"
                            to="/user/AllRecipes"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                        <MenuItem
                            icon={<FaUserMd />}
                            label="Cooking"
                            to="/chef/cooking"
                            currentPath={currentPath}
                            isCollapsed={isCollapsed}
                        />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 h-screen bg-[#469b7e] 
      flex flex-col justify-between items-center py-10 shadow-xl z-50 transition-all duration-500 ease-in-out
      ${isCollapsed ? "w-20" : "w-64"}`}
        >
            {/* Top section */}
            <div className="flex flex-col items-center w-full">
                <div className="relative w-full flex justify-end px-4 mb-4">
                    <button
                        onClick={toggleSidebar}
                        className="text-white mr-[11px] text-2xl focus:outline-none cursor-pointer transition-transform hover:rotate-90 duration-300"
                    >
                        {isCollapsed ? <FaBars /> : <FaTimes />}
                    </button>
                </div>

                {!isCollapsed && (
                    <h1
                        onClick={() => navigate("/")}
                        className="text-3xl font-extrabold text-white mb-4 transition duration-300 animate-pulse cursor-pointer hover:text-gray-200"
                    >
                        Cook Sync
                    </h1>
                )}

                {userName && !isCollapsed && (
                    <p className="text-white text-lg mb-6 animate-fade-in">
                        Welcome, {userName}
                    </p>
                )}

                <div className="flex flex-col gap-4 w-full px-4">
                    {renderMenuItems()}
                </div>
            </div>

            {/* Bottom logout section */}
            <div className={`w-full ${isCollapsed ? "px-2" : "px-6"}`}>
                <div
                    onClick={handleLogout}
                    className={`flex items-center ${
                        isCollapsed ? "justify-center" : "gap-3"
                    } px-4 py-2 text-xl text-white hover:bg-[#3b7d68] rounded-md cursor-pointer 
          transition duration-300 ease-in-out shadow-md hover:shadow-lg`}
                >
                    <FaSignOutAlt className="text-white" />
                    {!isCollapsed && <span className="text-white">Logout</span>}
                </div>
            </div>
        </div>
    );
};

export default Admin_Sidebar;
