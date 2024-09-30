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

// Регистрация необходимых компонентов для графика
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopGoodsChart = () => {
    const [data, setData] = useState(null);  // Изначально данные null, а не []
    const [loading, setLoading] = useState(false); // Обновил начальное состояние для четкости
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchTopGoods = async () => {
        try {
            const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!token) {
                throw new Error('Token not found');
            }

            console.log('Using token:', token); // Для отладки

            const response = await axios.get(`http://localhost:8000/top_goods?start=${startDate}&end=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.length > 0) {
                setData(response.data);  // Обновляем данные только если они есть
            } else {
                setData([]);  // Если данных нет, устанавливаем пустой массив
            }

        } catch (error) {
            console.error('Error fetching top goods:', error.response ? error.response.data : error);
            setData([]);  // В случае ошибки также устанавливаем пустой массив
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
        labels: data ? data.map(item => item.name) : [],  // Если данных нет, возвращаем пустой массив
        datasets: [
            {
                label: 'Количество продаж',
                data: data ? data.map(item => item.total_sold) : [],  // Если данных нет, возвращаем пустой массив
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,  // Отменяет фиксированное соотношение сторон
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
        <div > {/* Ограничиваем ширину и центрируем */}
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
                    <div style={{ height: '400px' }}> {/* Ограничиваем высоту контейнера диаграммы */}
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                ) : <p>Нет данных для отображения. Пожалуйста, выберите даты.</p>
            )}
        </div>
    );
};

export default TopGoodsChart;
