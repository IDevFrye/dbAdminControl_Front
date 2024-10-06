import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesPage.scss';
import AdminHeader from '../../components/AdminHeader';
import Notification from '../../components/Notification';

const SalesPage = () => {
    const [sales, setSales] = useState([]);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [newSale, setNewSale] = useState({ good_id: '', good_count: '', create_date: '' });
    const [notification, setNotification] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ASC' });
    const [goods, setGoods] = useState([]);


    useEffect(() => {
        fetchSales();
        fetchGoods();
    }, []);
    
    const fetchGoods = async () => {
        try {
            const token = localStorage.getItem('token');
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
    

    const fetchSales = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/sales', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту заявку?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/sales/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchSales();
            } catch (error) {
                setNotification('Произошла ошибка при удалении заявки.');
            }
        }
    };

    const handleSave = async (id, index) => {
        const saleToUpdate = { ...sales[index], good_count: parseInt(sales[index].good_count) };
        console.log(saleToUpdate);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/sales/${id}`, saleToUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEditingIndex(-1);
            fetchSales();
        } catch (error) {
            console.error('Error updating sale:', error);
            if (error.response) {
                setNotification(error.response.data);
                setTimeout(() => {
                    setNotification('');
                }, 3000);
            }
        }
    };

    const handleAdd = async () => {
        try {
            const saleToAdd = {
                good_id: parseInt(newSale.good_id),
                good_count: parseInt(newSale.good_count),
                create_date: newSale.create_date,
            };
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/sales', saleToAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewSale({ good_id: '', good_count: '', create_date: '' });
            fetchSales();
        } catch (error) {
            console.error('Error adding sale:', error);
            if (error.response) {
                setNotification(error.response.data);
                setTimeout(() => {
                    setNotification('');
                }, 3000);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const sortSales = (key) => {
        let direction = 'ASC';

        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DESC';
        }

        const sortedSales = [...sales].sort((a, b) => {
            if (typeof a[key] === 'string') {
                return direction === 'ASC'
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            } else {
                return direction === 'ASC' ? a[key] - b[key] : b[key] - a[key];
            }
        });

        setSales(sortedSales);
        setSortConfig({ key, direction });
    };

    return (
        <div className="sales-page">
            <AdminHeader />
            <div className="goods-table-view">
            <h2 className='header_h2'>Заявки</h2>
            {notification && <Notification message={notification} onClose={() => setNotification('')} />}
            <table>
                <thead>
                    <tr>
                        <th className="sortable" onClick={() => sortSales('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        <th className="sortable" onClick={() => sortSales('good_id')}>ID товара {sortConfig.key === 'good_id' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        <th className="sortable" onClick={() => sortSales('good_name')}>Название товара {sortConfig.key === 'good_name' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        <th className="sortable" onClick={() => sortSales('good_count')}>Количество {sortConfig.key === 'good_count' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        <th className="sortable" onClick={() => sortSales('create_date')}>Дата создания {sortConfig.key === 'create_date' && (sortConfig.direction === 'ASC' ? '↑' : '↓')}</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale, index) => (
                        <tr key={sale.id}>
                            <td>{sale.id}</td>
                            <td>{sale.good_id}</td>
                            <td>{sale.good_name}</td>
                            <td>
                                {editingIndex === index ? (
                                    <input
                                        type="number"
                                        value={sale.good_count}
                                        onChange={(e) => {
                                            const updatedSales = [...sales];
                                            updatedSales[index].good_count = e.target.value;
                                            setSales(updatedSales);
                                        }}
                                    />
                                ) : (
                                    sale.good_count
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <input
                                        type="date"
                                        value={sale.create_date}
                                        onChange={(e) => {
                                            const updatedSales = [...sales];
                                            updatedSales[index].create_date = e.target.value;
                                            setSales(updatedSales);
                                        }}
                                    />
                                ) : (
                                    formatDate(sale.create_date)
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <button onClick={() => handleSave(sale.id, index)}><i className="fa-solid fa-circle-check"></i></button>
                                ) : (
                                    <button onClick={() => handleEdit(index)}><i className="fa-solid fa-pencil"></i></button>
                                )}
                                <button onClick={() => handleDelete(sale.id)}><i className="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td>
                            <select
                                value={newSale.good_id}
                                onChange={(e) => setNewSale({ ...newSale, good_id: e.target.value })}
                            >
                                <option value="">Выберите товар</option>
                                {goods.map((good) => (
                                    <option key={good.id} value={good.id}>
                                        {good.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input
                                type="number"
                                value={newSale.good_count}
                                onChange={(e) => setNewSale({ ...newSale, good_count: e.target.value })}
                                placeholder="Количество"
                            />
                        </td>
                        <td>
                            <input
                                type="date"
                                value={newSale.create_date}
                                onChange={(e) => setNewSale({ ...newSale, create_date: e.target.value })}
                                placeholder="Дата создания"
                            />
                        </td>
                        <td>
                            <button onClick={handleAdd}><i className="fa-solid fa-circle-plus"></i></button>
                        </td>
                    </tr>

                </tbody>

            </table>
            </div>
        </div>
    );
};

export default SalesPage;
