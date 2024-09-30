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
    Legend,
} from 'chart.js';
import { format } from 'date-fns'; // Для форматирования дат
import { ru } from 'date-fns/locale'; // Локализация для русского языка

// Регистрация необходимых компонентов
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DemandChangeChart = () => {
    const [goods, setGoods] = useState([]);
    const [selectedGood, setSelectedGood] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [demandData, setDemandData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false); // Новое состояние для контроля отображения графика

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setDataFetched(false); // Сбрасываем состояние, чтобы скрыть график перед загрузкой новых данных
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get(`http://localhost:8000/demand_change`, {
                params: {
                    good_id: selectedGood,
                    start_date: startDate,
                    end_date: endDate,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDemandData(response.data);
            setDataFetched(true); // Устанавливаем состояние, когда данные были успешно загружены
        } catch (error) {
            console.error('Error fetching demand data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Функция для форматирования дат в "дд.мм.гггг"
    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
    };

    const chartData = {
        labels: demandData.map(item => formatDate(item.date)),
        datasets: [
            {
                label: 'Количество продаж',
                data: demandData.map(item => item.total_sold),
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Синий цвет для приятного вида
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Чтобы управлять шириной и высотой
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 45, // Ограничить максимальный угол поворота текста
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
            <h2>Анализ спроса на товар</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <select
                    value={selectedGood}
                    onChange={(e) => setSelectedGood(e.target.value)}
                    required
                    style={{ marginRight: '10px', flexGrow: 1 }}
                >
                    <option value="">Выберите товар</option>
                    {goods.map(good => (
                        <option key={good.id} value={good.id}>{good.name}</option>
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
                <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
            </form>
            {loading ? <p>Loading...</p> : (
                dataFetched ? (
                    <div style={{ width: '600px', height: '400px' }}> {/* Установка размеров */}
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    demandData.length === 0 && <p>Нет данных для отображения. Пожалуйста, выберите товар и даты.</p>
                )
            )}
        </div>
    );
};

export default DemandChangeChart;
