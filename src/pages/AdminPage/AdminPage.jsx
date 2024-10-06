import React from "react";
import logo from "./logo.png";
import "./AdminPage.scss";
import TopGoodsChart from './TopGoodsChart';
import DemandChangeChart from './DemandChangeChart';
import StockRequestInfo from '../../components/StockRequestInfo';
import ForecastDemandChart from './ForecastDemandChart';
import GoodsTransferInfo from '../../components/GoodsTransferInfo'; 
import { Link } from "react-router-dom";
import AdminHeader from '../../components/AdminHeader';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <AdminHeader />
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

export default AdminPage;
