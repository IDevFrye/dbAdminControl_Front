import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoodsTransferInfo = () => {
    const [goodsTransfer, setGoodsTransfer] = useState([]);

    // Объявляем fetchGoodsTransfer как отдельную функцию
    const fetchGoodsTransfer = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.get('http://localhost:8000/goods-for-transfer', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGoodsTransfer(response.data);
        } catch (error) {
            console.error('Error fetching goods for transfer:', error);
        }
    };

    useEffect(() => {
        fetchGoodsTransfer();
    }, []);

    // Функция для определения цвета фона в зависимости от приоритета
    const getRowStyle = (priority) => {
        if (priority >= 4) return { backgroundColor: '#6fbd5744', color: 'white' };
        else if (priority >= 3) return { backgroundColor: '#f5aa4244', color: 'black' };
        else return { backgroundColor: '#f5514244', color: 'white' };
        return {};
    };

    // Обработчик нажатия кнопки "Списать"
    const handleTransfer = async (good) => {
        try {
            const token = localStorage.getItem('token'); // Берем токен из localStorage
    
            // Убедимся, что мы отправляем правильный числовой тип
            const response = await axios.post('http://localhost:8000/transfer-goods', {
                good_id: good.good_id, // ID товара
                amount: parseInt(good.need_to_transfer, 10), // Приведение к числу
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // После успешного перевода обновляем данные
            alert(`Товар "${good.good_name}" успешно переведен`);
            fetchGoodsTransfer(); // Обновляем список товаров после перевода
        } catch (error) {
            console.error('Ошибка при переводе товара:', error);
            alert(error.response ? error.response.data : 'Не удалось перевести товар');
        }
    };
    
    
    

    return (
        <div className="goods-transfer-info">
            <table className="goods-transfer-table">
                <thead>
                    <tr>
                        <th>Название товара</th>
                        <th>Перевод</th>
                        <th>Приоритет</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {goodsTransfer.length > 0 ? (
                        goodsTransfer.map((good, index) => (
                            <tr key={index} style={getRowStyle(good.priority)}>  {/* Применение стиля на основе приоритета */}
                                <td>{good.good_name}</td>
                                <td>{good.need_to_transfer}</td>
                                <td>{good.priority}</td>
                                <td>
                                    <button
                                        onClick={() => handleTransfer(good)}
                                        disabled={good.need_to_transfer <= 0 || good.priority < 0}
                                    >
                                        Списать
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Данных нет</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
    
};

export default GoodsTransferInfo;
