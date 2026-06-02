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

function App() {
  const token = localStorage.getItem("token");
  //alert(token);
  //localStorage.removeItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fff" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" /> } />
        <Route path="/login" element={<AuthOne />} />
        <Route path="/dashboard" element={<Security><Header /><Dashboard /></Security>} />
      </Routes>
    </Router>
  )
}

export default App
