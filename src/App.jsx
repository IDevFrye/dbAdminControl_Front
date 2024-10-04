// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import UserPage from "./pages/UserPage/UserPage";
import GoodsPage from './pages/GoodsPage/GoodsPage';
import SalesPage from './pages/SalesPage/SalesPage';
import WarehousesPage from './pages/WarehousesPage/WarehousesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/goods" element={<GoodsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
      </Routes>
    </Router>
  );
}

export default App;




