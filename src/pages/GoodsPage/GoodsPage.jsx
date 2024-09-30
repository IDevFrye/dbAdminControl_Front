// src/pages/GoodsPage/GoodsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../AdminPage/logo.png";
import { Link } from "react-router-dom";
import './GoodsPage.scss';

const GoodsPage = () => {
    const [goods, setGoods] = useState([]);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [newGood, setNewGood] = useState({ name: '', priority: '' });

    useEffect(() => {
        fetchGoods();
    }, []);

    const fetchGoods = async () => {
        try {
            const token = localStorage.getItem('token'); // Извлекаем токен из localStorage
            const response = await axios.get('http://localhost:8000/goods1', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGoods(response.data);
        } catch (error) {
            console.error('Error fetching goods:', error);
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
            try {
                const token = localStorage.getItem('token'); // Извлекаем токен из localStorage
                await axios.delete(`http://localhost:8000/goods/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchGoods();
            } catch (error) {
                if (error.response) {
                    // Если есть ответ с ошибкой от сервера, отобразим его
                    alert(error.response.data); // Отображаем сообщение об ошибке
                } else {
                    console.error('Error deleting good:', error);
                    alert('Произошла ошибка при удалении товара.');
                }
            }
        }
    };
    

    const handleSave = async (id, index) => {
        const goodToUpdate = { ...goods[index], priority: parseFloat(goods[index].priority) };
        try {
            const token = localStorage.getItem('token'); // Извлекаем токен из localStorage
            await axios.put(`http://localhost:8000/goods/${id}`, goodToUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEditingIndex(-1);
            fetchGoods();
        } catch (error) {
            console.error('Error updating good:', error);
        }
    };

    const handleAdd = async () => {
        try {
            const goodToAdd = {
                name: newGood.name,
                priority: parseFloat(newGood.priority),
            };
            const token = localStorage.getItem('token'); // Извлекаем токен из localStorage
            await axios.post('http://localhost:8000/goods', goodToAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewGood({ name: '', priority: '' });
            fetchGoods();
        } catch (error) {
            console.error('Error adding good:', error);
        }
    };

    return (
        <div className="goods-page">
            <header className="admin-header">
                <span>
                <img src={logo} alt="ddd" draggable="false"/>
                <h1>Admin Dashboard</h1>
                </span>
                <div className="admin-controls">
                <Link to="/admin">Главная</Link>
                <Link to="/goods">Товары</Link>
                <Link to="/sales">Заявки</Link>
                <Link to="/warehouse1">Склад 1</Link>
                <Link to="/warehouse2">Склад 2</Link>
                </div>
            </header>
            <h2>Товары</h2>
            <table>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Приоритет</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {goods.map((good, index) => (
                        <tr key={good.id}>
                            <td>
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={good.name}
                                        onChange={(e) => {
                                            const updatedGoods = [...goods];
                                            updatedGoods[index].name = e.target.value;
                                            setGoods(updatedGoods);
                                        }}
                                    />
                                ) : (
                                    good.name
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <input
                                        type="number"
                                        value={good.priority}
                                        onChange={(e) => {
                                            const updatedGoods = [...goods];
                                            updatedGoods[index].priority = e.target.value; // Сохраняем как строку
                                            setGoods(updatedGoods);
                                        }}
                                    />
                                ) : (
                                    good.priority
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <button onClick={() => handleSave(good.id, index)}><i class="fa-solid fa-circle-check"></i></button>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(index)}><i class="fa-solid fa-pencil"></i></button>
                                        <button onClick={() => handleDelete(good.id)}><i class="fa-solid fa-trash-can"></i></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input
                                type="text"
                                value={newGood.name}
                                onChange={(e) => setNewGood({ ...newGood, name: e.target.value })}
                                placeholder="Название товара"
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={newGood.priority}
                                onChange={(e) => setNewGood({ ...newGood, priority: e.target.value })}
                                placeholder="Приоритет"
                            />
                        </td>
                        <td>
                            <button onClick={handleAdd}><i class="fa-solid fa-circle-plus"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GoodsPage;
