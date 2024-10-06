import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoodsTransferInfo = () => {
    const [goodsTransfer, setGoodsTransfer] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [role, setRole] = useState('');
    const fetchGoodsTransfer = async () => {
        try {
            const role = localStorage.getItem('role');
            setRole(role);
            console.log(role);
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

    const getRowStyle = (priority) => {
        if (priority >= 4) return { backgroundColor: '#6fbd5744', color: 'white' };
        else if (priority >= 3) return { backgroundColor: '#f5aa4244', color: 'black' };
        else return { backgroundColor: '#f5514244', color: 'white' };
    };

    const handleTransfer = async (good) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Initiating transfer for good:', good);
            const response = await axios.post('http://localhost:8000/transfer-goods', {
                good_id: good.good_id,
                amount: parseInt(good.need_to_transfer, 10),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Transfer response:', response.data);
            alert(`Товар "${good.good_name}" успешно переведен`);
            fetchGoodsTransfer(); 
        } catch (error) {
            console.error('Ошибка при переводе товара:', error);
            alert(error.response ? error.response.data : 'Не удалось перевести товар');
        }
    };

    const handleSort = () => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newSortDirection);

        const sortedGoods = [...goodsTransfer].sort((a, b) => {
            const amountA = parseInt(a.need_to_transfer, 10);
            const amountB = parseInt(b.need_to_transfer, 10);
            return newSortDirection === 'asc' ? amountA - amountB : amountB - amountA;
        });

        setGoodsTransfer(sortedGoods);
    };

    return (
        <div className="goods-transfer-info">
            <table className="goods-transfer-table">
                <thead>
                    <tr>
                        <th>Название товара</th>
                        <th style={{ cursor: 'pointer' }} onClick={handleSort}>
                            Перевод {sortDirection === 'asc' ? <i class="fa-solid fa-arrow-up"></i> : <i class="fa-solid fa-arrow-down"></i>}
                        </th>
                        <th>Приоритет</th>
                        {role === 'admin'
                        ? (<th>Действие</th>
                        ):(<div></div>)}
                        
                    </tr>
                </thead>
                <tbody>
                    {goodsTransfer.length > 0 ? (
                        goodsTransfer.map((good, index) => (
                            <tr key={index} style={getRowStyle(good.priority)}>
                                <td style={{ textAlign: 'center' }}>{good.good_name}</td>
                                <td style={{ textAlign: 'center' }}>{good.need_to_transfer}</td>
                                <td style={{ textAlign: 'center' }}>{good.priority}</td>
                               {role === 'admin'
                                ? (<td style={{ textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleTransfer(good)}
                                        disabled={good.need_to_transfer <= 0 || good.priority < 0}
                                        className={good.need_to_transfer <= 0 || good.priority < 0 ? 'disabled-button' : ''}
                                    >
                                        Списать
                                    </button>
                                </td>
                                ):(<div></div>)}
                                
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>Данных нет</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GoodsTransferInfo;
