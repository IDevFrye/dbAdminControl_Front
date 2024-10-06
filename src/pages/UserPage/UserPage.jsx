// src/pages/AdminPage/AdminPage.jsx
import React from "react";
import logo from "../AdminPage/logo.png";
import "../AdminPage/AdminPage.scss";
import TopGoodsChart from '../AdminPage/TopGoodsChart';
import DemandChangeChart from '../AdminPage/DemandChangeChart';
import StockRequestInfo from '../../components/StockRequestInfo';
import ForecastDemandChart from '../AdminPage/ForecastDemandChart';
import GoodsTransferInfo from '../../components/GoodsTransferInfo'; // Импортируем новый компонент
import { Link } from "react-router-dom";
import UserHeader from '../../components/UserHeader';

const UserPage = () => {
  return (
    <div className="admin-page">
      <UserHeader />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
