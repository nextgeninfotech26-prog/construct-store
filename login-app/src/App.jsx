import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Auth from "./components/Auth.jsx"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import AuthOne from "./components/AuthOne.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Security from "./components/Security.jsx"
import { Navigate } from "react-router-dom"
import Header from "./components/Header.jsx"
import Cart from "./components/Cart.jsx"
import { useAuth } from "./AuthContext.jsx";
import ProfilePage from "./components/ProfilePage.jsx";

function App() {
  const { token, isRegisteredOrLogin } = useAuth();
  //alert(token);
  // localStorage.removeItem("token");
  // localStorage.removeItem("cart");
  // localStorage.removeItem("cartCount");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /><Dashboard /></>} />
        <Route path="/cart" element={<><Header /><Cart /></>} />
        <Route path="/fff" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" /> } />
        <Route path="/login" element={<AuthOne />} />
        <Route path="/dashboard" element={<Security><Header /><Dashboard /></Security>} />
        <Route path="/profile" element={<ProfilePage />}/>
      </Routes>
    </Router>
  )
}

export default App
