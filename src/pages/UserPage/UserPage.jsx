// src/pages/UserPage/UserPage.jsx
import React from "react";
import "./UserPage.scss";
import { Link } from "react-router-dom";

const UserPage = () => {
  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <div className="user-controls">
        <Link to="/goods">Товары</Link>
        <Link to="/sales">Заявки</Link>
        <Link to="/warehouse1">Склад 1</Link>
        <Link to="/warehouse2">Склад 2</Link>
      </div>
      
      <div className="statistics">
        <h2>Статистика</h2>
        <div className="chart">
          <h3>Пять самых популярных товаров</h3>
          {/* Компонент диаграммы */}
        </div>
        <div className="chart">
          <h3>Изменение спроса за период</h3>
          {/* Компонент диаграммы */}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
