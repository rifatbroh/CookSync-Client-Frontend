import AllRecipes from "../Components/AllRecipes";
import Footer from "../Components/Single Component/Footer";
import Header from "../Components/Single Component/Header";
import Hero from "../Components/Single Component/Hero";

const Home = () => {
    return (
        <div>
            <Header />
            <Hero />
            <AllRecipes />
            <Footer />
        </div>
    );
};

export default Home;
