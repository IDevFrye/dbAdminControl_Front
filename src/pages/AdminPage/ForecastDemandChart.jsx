// src/pages/AdminPage/ForecastDemandChart.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { format, addDays, isValid, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

// Регистрация необходимых компонентов
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const ForecastDemandChart = () => {
    const [goods, setGoods] = useState([]); // Хранение списка товаров
    const [selectedGood, setSelectedGood] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    // Функция для загрузки списка товаров
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
            console.error('Ошибка при загрузке товаров:', error);
        }
    };

    // Эффект для загрузки товаров при монтировании компонента
    useEffect(() => {
        fetchGoods();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setDataFetched(false);
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`http://localhost:8000/forecast_demand`, {
                params: {
                    good_id: selectedGood,
                    start_date: startDate,
                    end_date: endDate,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setForecastData(response.data.forecast); // Обновляем с учетом изменения на бэкенде
            setDataFetched(true);
        } catch (error) {
            console.error('Ошибка при получении данных прогноза:', error);
        } finally {
            setLoading(false);
        }
    };

    // Подготовка данных для графика
    const chartData = {
        labels: Array.from({ length: 7 }, (_, i) => {
            const nextDate = addDays(parseISO(endDate), i + 1); // Парсинг даты
            return isValid(nextDate) ? format(nextDate, 'dd.MM.yyyy', { locale: ru }) : ''; // Проверка на корректность даты
        }),
        datasets: [
            {
                label: 'Прогноз спроса',
                data: forecastData, // Прогнозные значения
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true, // Заполняем под линией
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
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <select
                    value={selectedGood}
                    onChange={(e) => setSelectedGood(e.target.value)}
                    required
                    style={{ marginRight: '10px', flexGrow: 1 }}
                >
                    <option value="">Выберите товар</option>
                    {goods.map(good => (
                        <option key={good.id} value={good.id}>
                            {good.name}
                        </option>
                    ))}
                </select>
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
                <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
            </form>
            {loading ? <p>Loading...</p> : (
                dataFetched ? (
                    <div style={{ width: '600px', height: '400px' }}>
                        <Line data={chartData} options={chartOptions} /> {/* Используем компонент Line */}
                    </div>
                ) : (
                    forecastData.length === 0 && <p>Нет данных для отображения. Пожалуйста, выберите товар и даты.</p>
                )
            )}
        </div>
    );
};

export default ForecastDemandChart;
