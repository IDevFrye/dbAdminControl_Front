import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopGoodsChart = () => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchTopGoods = async () => {
        try {
            const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!token) {
                throw new Error('Token not found');
            }

            console.log('Using token:', token);

            const response = await axios.get(`http://localhost:8000/top_goods?start=${startDate}&end=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.length > 0) {
                setData(response.data); 
            } else {
                setData([]);  
            }

        } catch (error) {
            console.error('Error fetching top goods:', error.response ? error.response.data : error);
            setData([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchTopGoods();
    };

    const chartData = {
        labels: data ? data.map(item => item.name) : [],  
        datasets: [
            {
                label: 'Количество продаж',
                data: data ? data.map(item => item.total_sold) : [],  
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,  
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div >
        <h2>Топ-5 популярных товаров</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    required 
                    style={{ marginRight: '10px', flexGrow: 1 }}
                />
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    required 
                    style={{ marginRight: '10px', flexGrow: 1 }}
                />
                <button type="submit" style={{ flexGrow: 1 }}><i class="fa-solid fa-magnifying-glass"></i></button>
            </form>
            {loading ? <p>Loading...</p> : (
                data && data.length > 0 ? (
                    <div style={{ height: '400px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                ) : <p>Нет данных для отображения. Пожалуйста, выберите даты.</p>
            )}
        </div>
    );
};

export default TopGoodsChart;
