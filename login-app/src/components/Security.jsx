import { Navigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { useAuth } from "../AuthContext";

function Security({ children }){
    const { token , setToken } = useAuth();
    if (!token) {
        return <Navigate to="/login" />;
    }
    try {

        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {

        setToken(null);

        return <Navigate to="/login" />;
        }

    } catch (error) {

        setToken(null);

        return <Navigate to="/login" />;
    }
    return children;
}
export default Security;