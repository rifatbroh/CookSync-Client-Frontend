import { NavLink } from "react-router-dom";

const MenuItem = ({ icon, label, to, currentPath, isCollapsed }) => {
  const isActive = currentPath === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-4 px-4 py-2 rounded-md text-white hover:bg-[#3b7d68] transition duration-200 
        ${isActive ? "bg-[#3b7d68]" : ""}
        ${isCollapsed ? "justify-center" : ""}
      `}
    >
      <div className="text-lg">{icon}</div>
      {!isCollapsed && <span className="text-md">{label}</span>}
    </NavLink>
  );
};

export default MenuItem;
