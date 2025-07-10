import jwtDecode from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import axios from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            axios
                .get(`/users/${decoded.id}`)
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => setUser(null));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
