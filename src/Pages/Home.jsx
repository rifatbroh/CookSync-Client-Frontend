import AllRecipes from "../Components/AllRecipes";
import Footer from "../Components/Single Component/Footer";
import Header from "../Components/Single Component/Header";
import Hero from "../Components/Single Component/Hero";
import Text from "../Components/Single Component/Text";
import AboutUs from "./AboutUs";

const Home = () => {
    return (
        <div>
            <Header />
            <Hero />
            <Text />
            <AllRecipes />
            <AboutUs />
            <Footer />
        </div>
    );
};

export default Home;
