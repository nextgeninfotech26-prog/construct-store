import { Navigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

function Security({ children }){
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" />;
    }
    try {

        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {

        localStorage.removeItem("token");

        return <Navigate to="/login" />;
        }

    } catch (error) {

        localStorage.removeItem("token");

        return <Navigate to="/login" />;
    }
    return children;
}
export default Security;