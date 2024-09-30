// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import UserPage from "./pages/UserPage/UserPage";
import GoodsPage from './pages/GoodsPage/GoodsPage';
import SalesPage from './pages/SalesPage/SalesPage';
import Warehouse1Page from './pages/Warehouse1Page/Warehouse1Page';
import Warehouse2Page from './pages/Warehouse2Page/Warehouse2Page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/goods" element={<GoodsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/warehouse1" element={<Warehouse1Page />} />
        <Route path="/warehouse2" element={<Warehouse2Page />} />
      </Routes>
    </Router>
  );
}

export default App;




