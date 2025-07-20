
import UserFavorites from '../../UserFavorites';
import Chef_recipie from './chef_recipie';

const Recipie_module = () => {
    return (
        <div>
            <UserFavorites />
            <h1>Your recipe</h1>
            <Chef_recipie />
        </div>
    );
};

export default Recipie_module;