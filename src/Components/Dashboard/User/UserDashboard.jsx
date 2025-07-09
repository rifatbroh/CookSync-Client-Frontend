import React from 'react';
import RequestChefAccess from '../../RequestChefAccess';
import AllRecipes from '../../AllRecipes';

const UserDashboard = () => {
    return (
        <div>
            <RequestChefAccess />
            <AllRecipes />
        </div>
    );
};

export default UserDashboard;