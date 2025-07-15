import AllRecipes from "../Components/AllRecipes";
import Footer from "../Components/Single Component/Footer";
import Header from "../Components/Single Component/Header";
import Hero from "../Components/Single Component/Hero";
import Text from "../Components/Single Component/Text";

const Home = () => {
    return (
        <div>
            <Header />
            <Hero />
            <Text />
            <AllRecipes />
            <Footer />
        </div>
    );
};

export default Home;
