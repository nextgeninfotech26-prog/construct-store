// AuthContext.js
import { createContext, useContext, useState , useEffect} from "react";
import api from "./api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [isRegisteredOrLogin, setIsRegisteredOrLogin] = useState(false);

  const getExistingCartCount = (e) => {
      const storedCartCount = localStorage.getItem("cartCount");
      if (storedCartCount) {
          setCartCount(parseInt(storedCartCount));
      }
      console.log("Existing Cart Count:- ", token, storedCartCount);
      if(token){
          setIsLoggedIn(true);
          api.get("/cart-count")
              .then(response => {
                  setCartCount(parseInt(response.data.count));
                  localStorage.setItem("cartCount", 0);
              })
              .catch(error => {
                  console.error("Error updating cart count:", error);
              });
      }        
  }
  useEffect(() => {
      getExistingCartCount();
  }, []);

  const handleInputChange = (productId, value) => {
        const quantity = parseInt(value, 10);

        setQuantities(prev => ({
            ...prev,
            [productId]: isNaN(quantity) ? 1 : Math.max(1, quantity)
        }));
    };

    const handleQuantityChange = (productId, change) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }));
    }

  return (
    <AuthContext.Provider value={{ token, setToken, cartCount, getExistingCartCount, isLoggedIn, setIsLoggedIn , quantities, handleInputChange, handleQuantityChange , isRegisteredOrLogin, setIsRegisteredOrLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);