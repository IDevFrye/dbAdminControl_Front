// src/pages/AdminPage/AdminPage.jsx
import React from "react";
import logo from "./logo.png";
import "./AdminPage.scss";
import TopGoodsChart from './TopGoodsChart';
import DemandChangeChart from './DemandChangeChart';
import StockRequestInfo from '../../components/StockRequestInfo';
import ForecastDemandChart from './ForecastDemandChart';
import GoodsTransferInfo from '../../components/GoodsTransferInfo'; // Импортируем новый компонент
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <span>
          <img src={logo} alt="ddd" draggable="false"/>
          <h1>Admin Dashboard</h1>
        </span>
        <div className="admin-controls">
          <Link to="/goods">Товары</Link>
          <Link to="/sales">Заявки</Link>
          <Link to="/warehouse1">Склад 1</Link>
          <Link to="/warehouse2">Склад 2</Link>
        </div>
      </header>
      <div className="statistics-container">
        <div className="charts">
          <h2 className="header_h2">Статистика</h2>
          <hr />
          <div className="chart">
            <TopGoodsChart />
          </div>
          <div className="chart">
            <DemandChangeChart />
          </div>
          <div className="chart">
            <h2>Прогноз спроса на товар</h2>
            <ForecastDemandChart />
          </div>
        </div>
        <div className="info-panels">
          <h2 className="header_h2">Сводная информация</h2>
          <span className="j"><hr /></span>
          <div className="card">
            <h2>Информация по товару</h2>
            <StockRequestInfo />
          </div>

          <div className="card">
            <h2>Товары для перевода между складами</h2>
            <GoodsTransferInfo />
          </div>
          
          <div className="additional-chart" style={{ height: '25%' }}>
            {/* Здесь можно добавить дополнительную диаграмму */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
