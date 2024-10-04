// src/pages/GoodsPage/GoodsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../AdminPage/logo.png";
import { Link } from "react-router-dom";
import './WarehousesPage.scss';
import AdminHeader from '../../components/AdminHeader';

const WarehousesPage = () => {
    const [wh1goods, setWH1Goods] = useState();
    const [wh2goods, setWH2Goods] = useState();

    useEffect(()=>{
        fetchWH1();
        fetchWH2();
    });

    const fetchWH1 = async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/wh1", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setWH1Goods(response.data);
        } catch (error) {
            console.error("Error fetching WH1: ", error);
        }
    };

    const fetchWH2 = async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/wh2", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setWH2Goods(response.data);
        } catch (error) {
            console.error("Error fetching WH1: ", error);
        }
    };

    


}

export default WarehousesPage