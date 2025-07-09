import AllRecipes from "../../AllRecipes";
import CreateRecipe from "../../CreateRecipe";

export default function ChefDashboard() {
    return (
        <div>
            <h1 className="text-xl font-bold m-4">Chef Panel</h1>
            <AllRecipes />
            <CreateRecipe />
        </div>
    );
}
