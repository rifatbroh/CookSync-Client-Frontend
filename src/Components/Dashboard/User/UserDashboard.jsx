import AllRecipes from "./AllRecipes";
import RequestChefAccess from "./RequestChefAccess";

export default function UserDashboard() {
    return (
        <div>
            <h1 className="text-xl font-bold m-4">Welcome, User</h1>
            <RequestChefAccess />
            <AllRecipes />
        </div>
    );
}
