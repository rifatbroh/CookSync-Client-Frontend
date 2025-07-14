import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import AllRecipes from "./Components/AllRecipes";
import Login from "./Components/Authentication/Login";
import CreateRecipe from "./Components/CreateRecipe";
import Main_Admin from "./Components/Dashboard/Admin/Main_Admin";
import Preferences from "./Components/Dashboard/Admin/Preferences";
import Recipie from "./Components/Dashboard/Admin/Recipie";
import User from "./Components/Dashboard/Admin/User";
import Cooking from "./Components/Dashboard/Cheff/Cooking";
import Main_Cheff from "./Components/Dashboard/Cheff/Main_Cheff";
import Order_list from "./Components/Dashboard/Cheff/Order_list";
import Admin_Layout from "./Components/Dashboard/Layout/Admin_layout";
import Cheff_layout from "./Components/Dashboard/Layout/Cheff_layout";
import User_layout from "./Components/Dashboard/Layout/User_layout";
import Chat from "./Components/Dashboard/User/Chat";
import Main_User from "./Components/Dashboard/User/Main_User";
import { ToggleFavorite } from "./Components/Dashboard/User/ToggleFavorite";
import About from "./Pages/About";
import Home from "./Pages/Home";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />

                <Route path="/all" element={<AllRecipes />} />
                <Route path="/mk" element={<CreateRecipe />} />
                <Route path="/to" element={<ToggleFavorite />} />

                {/* Admin Panel  -->  http://localhost:5173/admin/dashboard */}
                <Route path="/admin" element={<Admin_Layout />}>
                    <Route path="dashboard" element={<Main_Admin />} />
                    <Route path="recipie" element={<Recipie />} />
                    <Route path="user" element={<User />} />
                    <Route path="preferences" element={<Preferences />} />

                    <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                    />
                </Route>

                {/* Chef Panel -- > http://localhost:5173/chef/dashboard */}
                <Route path="/chef" element={<Cheff_layout />}>
                    <Route path="dashboard" element={<Main_Cheff />} />
                    <Route path="cooking" element={<Cooking />} />
                    <Route path="order" element={<Order_list />} />

                    <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                    />
                </Route>

                {/* User Panel  -->  http://localhost:5173/user/dashboard */}
                <Route path="/user" element={<User_layout />}>
                    <Route path="dashboard" element={<Main_User />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="AllRecipes" element={<AllRecipes />} />

                    <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
