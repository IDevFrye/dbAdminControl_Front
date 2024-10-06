import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../AdminPage/logo.png";
import { Link } from "react-router-dom";
import './GoodsPage.scss';
import AdminHeader from '../../components/AdminHeader';
import Notification from '../../components/Notification';

const GoodsPage = () => {
    const [goods, setGoods] = useState([]);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [newGood, setNewGood] = useState({ name: '', priority: '' });
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(''); 
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ASC' }); 
    const [role, setRole] = useState('');

    const handleRole = () => {
        const role = localStorage.getItem('role');
        setRole(role);
    }
    useEffect(() => {
        handleRole();
        fetchGoods();
    }, []);

    const fetchGoods = async () => {
        try {
            const token = localStorage.getItem('token'); 
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
                const token = localStorage.getItem('token'); 
                await axios.delete(`http://localhost:8000/goods/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchGoods();
            } catch (error) {
                if (error.response) {
                    setError(error.response.data); 
                } else {
                    console.error('Error deleting good:', error);
                    setError('Произошла ошибка при удалении товара.');
                }
            }
        }
    };

    const handleSave = async (id, index) => {
        const goodToUpdate = { ...goods[index], priority: parseFloat(goods[index].priority) };
        try {
            const token = localStorage.getItem('token'); 
            await axios.put(`http://localhost:8000/goods/${id}`, goodToUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEditingIndex(-1);
            fetchGoods();
        } catch (error) {
            console.error('Error updating good:', error);
            if (error.response) {
                setNotification(error.response.data);
                showNotification(); 
            }
        }
    };

    const handleAdd = async () => {
        try {
            const goodToAdd = {
                name: newGood.name,
                priority: parseFloat(newGood.priority),
            };
            const token = localStorage.getItem('token'); 
            await axios.post('http://localhost:8000/goods', goodToAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewGood({ name: '', priority: '' });
            fetchGoods();
        } catch (error) {
            console.error('Error adding good:', error);
            if (error.response) {
                setNotification(error.response.data); 
                showNotification(); 
            }
        }
    };

    const showNotification = () => {
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const sortGoods = (key) => {
        let direction = 'ASC';

        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DESC';
        }

        const sortedGoods = [...goods].sort((a, b) => {
            if (typeof a[key] === 'string') {
                return direction === 'ASC' 
                    ? a[key].localeCompare(b[key]) 
                    : b[key].localeCompare(a[key]);
            } else {
                return direction === 'ASC' ? a[key] - b[key] : b[key] - a[key];
            }
        });

        setGoods(sortedGoods);
        setSortConfig({ key, direction });
    };

    return (
        <div className="goods-page">
            <AdminHeader />
            <div className="goods-table-view">
            <h2 className='header_h2'>Товары</h2>
            {error && <Notification message={error} onClose={() => setError('')} />}
            <table>
                <thead>
                    <tr>
                        <th className="sortable" onClick={() => sortGoods('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        <th className="sortable" onClick={() => sortGoods('name')}>Название {sortConfig.key === 'name' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        <th className="sortable" onClick={() => sortGoods('priority')}>Приоритет {sortConfig.key === 'priority' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        {role === 'admin' ? (<th>Действия</th>) : (<div></div>)}
                        
                    </tr>
                </thead>
                <tbody>
                    {goods.map((good, index) => (
                        <tr key={good.id}>
                            <td>{good.id}</td>
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
                                            updatedGoods[index].priority = e.target.value;
                                            setGoods(updatedGoods);
                                        }}
                                    />
                                ) : (
                                    good.priority
                                )}
                            </td>
                             {role === 'admin' 
                             ? (<td>
                                {editingIndex === index ? (
                                    <button onClick={() => handleSave(good.id, index)}><i className="fa-solid fa-circle-check"></i></button>
                                ) : (
                                    <button onClick={() => handleEdit(index)}><i className="fa-solid fa-pencil"></i></button>
                                )}
                                <button onClick={() => handleDelete(good.id)}><i className="fa-solid fa-trash"></i></button>
                            </td>)
                             : (<div></div>)}
                            
                        </tr>
                    ))}
                    {role === 'admin' 
                             ? (
                    <tr>
                        <td></td>
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
                            <button onClick={handleAdd}><i className="fa-solid fa-circle-plus"></i></button>
                        </td>
                    </tr>)
                    : (<div></div>)}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default GoodsPage;
