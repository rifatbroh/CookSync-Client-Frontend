import { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axios from "../../utils/axios"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const res = await axios.get(`/users/${decoded.id}`);
                    setUser(res.data);
                } catch (err) {
                    console.error("Auth error:", err);
                    setUser(null);
                }
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
