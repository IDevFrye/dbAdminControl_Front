import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockRequestInfo = () => {
    const [goods, setGoods] = useState([]);
    const [selectedGood, setSelectedGood] = useState('');
    const [stocks, setStocks] = useState({ warehouse1: 0, warehouse2: 0, priority: 0 });
    const [requestData, setRequestData] = useState({ quantity: 0 });

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get('http://localhost:8000/goods', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGoods(response.data);
            } catch (error) {
                console.error('Error fetching goods:', error);
            }
        };

        fetchGoods();
    }, []);

    const handleGoodChange = (e) => {
        setSelectedGood(e.target.value);
    };

    const handleCheckInfo = async () => {
    if (selectedGood) {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

            const stockResponse = await axios.get(`http://localhost:8000/warehouse_counts?good_id=${selectedGood}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const requestResponse = await axios.get(`http://localhost:8000/sales_counts?good_id=${selectedGood}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStocks({
                warehouse1: stockResponse.data.warehouse1_count || 0,
                warehouse2: stockResponse.data.warehouse2_count || 0,
                priority: requestResponse.data.priority || 0
            });

            setRequestData({
                quantity: requestResponse.data.quantity || 0
            });
        } catch (error) {
            console.error('Error fetching stock or request data:', error.response ? error.response.data : error.message);
        }
    }
};



    return (
        <div className="stock-request-info" >
            <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <select value={selectedGood} onChange={handleGoodChange} style={{ marginRight: '10px', flexGrow: 1 }}>
                    <option value="">Выберите товар</option>
                    {goods.map(good => (
                        <option key={good.id} value={good.id}>{good.name}</option>
                    ))}
                </select>
                <button onClick={handleCheckInfo} disabled={!selectedGood}><i class="fa-solid fa-magnifying-glass"></i></button>
            </span>
            <div className="info_data">
                <span className="info_card">
                    <i class="fa-solid fa-warehouse"></i>
                    <p>Склад 1 </p>
                    <span>{stocks.warehouse1}</span>
                </span>
                <span className="info_card">
                    <i class="fa-solid fa-warehouse"></i>
                    <p>Склад 2</p>
                    <span>{stocks.warehouse2}</span>
                </span>
                <span className="info_card">
                    <i class="fa-solid fa-money-bill"></i>
                    <p>Продажи</p>
                    <span>{requestData.quantity}</span>
                </span>
                <span className="info_card" style={{ backgroundColor: getPriorityColor(stocks.priority) }}>
                <i class="fa-solid fa-hashtag"></i>
                    <p>Приоритет</p>
                    <span>{stocks.priority}</span>
                </span>
            </div>
        </div>
    );
};

const getPriorityColor = (priority) => {
    if (priority <= 1) return '#f55142';
    if (priority <= 3) return '#f5aa42';
    if (priority <= 5) return '#6fbd57';
    return 'black';
};

export default StockRequestInfo;
