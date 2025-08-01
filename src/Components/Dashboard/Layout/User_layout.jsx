import { Outlet } from "react-router-dom";
import Admin_Sidebar from "../../Single Component/Admin_sidebar";
import TopNav from "../../Single Component/TopNav";

const User_layout = () => {
    return (
        <div className="admin flex">
            <div className="admin-left w-[20%]">
                <Admin_Sidebar role="user" />
            </div>

            {/* Main Content */}
            <div className="admin-right w-[80%] pr-20">
                <TopNav />
            <div className=" bg-[#fdfdfd] ">
                <Outlet />
            </div>
        </div>
    </div>
  );
};

export default User_layout;
