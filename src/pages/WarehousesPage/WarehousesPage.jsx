// src/pages/GoodsPage/GoodsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WarehousesPage.scss';
import AdminHeader from '../../components/AdminHeader';
import Notification from '../../components/Notification';
import AddGoods from '../../components/AddGoods';

const WarehousesPage = () => {
    const [goodsw1, setGoodsw1] = useState([]);
    const [goodsw2, setGoodsw2] = useState([]);
    const [wh1goods, setWH1Goods] = useState([]);
    const [wh2goods, setWH2Goods] = useState([]);
    const [newGoodWH1, setNewGoodWH1] = useState({good_id: '', good_count: ''});
    const [newGoodWH2, setNewGoodWH2] = useState({good_id: '', good_count: ''});
    const [notification, setNotification] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editingIndex2, setEditingIndex2] = useState(-1);
    const [sortConfigWH1, setSortConfigWH1] = useState({});
    const [sortConfigWH2, setSortConfigWH2] = useState({});

    useEffect(()=>{
        fetchWH1();
        fetchWH2();
        fetchGoods1();
        fetchGoods2();
    },[]);

    const fetchWH1 = async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/wh1", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setWH1Goods(response.data);
        } catch (error) {
            console.error("Error fetching WH1: ", error);
        }
    };

    const fetchWH2 = async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/wh2", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setWH2Goods(response.data);
        } catch (error) {
            console.error("Error fetching WH1: " + error);
        }
    };

    const fetchGoods1 = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/goodsw1', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGoodsw1(response.data);
        } catch (error) {
            console.error('Error by loading goods: '+ error);
        }
    }

    const fetchGoods2 = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/goodsw2', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGoodsw2(response.data);
        } catch (error) {
            console.error('Error by loading goods: '+ error);
        }
    }

    const handleAdd_W1 = async() => {
        try {
            const goodToAdd = {
                good_id : parseInt(newGoodWH1.good_id), 
                good_count : parseInt(newGoodWH1.good_count),
            }
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/wh1', goodToAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewGoodWH1({good_id: '', good_count: ''});
            fetchWH1();
        } catch (error) {
            console.error("Error by adding: " + error);
        }
    }

    const handleAdd_W2 = async() => {
        try {
            const goodToAdd = {
                good_id : parseInt(newGoodWH2.good_id), 
                good_count : parseInt(newGoodWH2.good_count),
            }
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/wh2', goodToAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewGoodWH2({good_id: '', good_count: ''});
            fetchWH2();
        } catch (error) {
            console.error("Error by adding: " + error);
        }
    }

    const handleDelete_W1 = async(id) => {
        if (window.confirm("Вы уверены, что хотите списать данный товар?")){
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/wh1/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchWH1();
            } catch (error) {
                console.error("Error by deleting: " + error);
            }
        }
    }

    const handleDelete_W2 = async(id) => {
        if (window.confirm("Вы уверены, что хотите списать данный товар?")){
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/wh2/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchWH2();
            } catch (error) {
                console.error("Error by deleting: " + error);
            }
        }
    }

    const handleSave_W1 = async(id, index) => {
        try {
            const goodToSave = {
                ...wh1goods[index],
                good_count: parseInt(wh1goods[index].good_count),
            };
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/wh1/${id}`, goodToSave, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEditingIndex(-1);
            fetchWH1();
        } catch (error) {
            console.error("Error by saving: " + error);
            if (error.response) {
                setNotification(error.response.data);
                setTimeout( () => {
                    setNotification('');
                },3000)
            }
        }
    }

    const handleSave_W2 = async(id, index) => {
        try {
            const goodToSave = {
                ...wh2goods[index],
                good_count: parseInt(wh2goods[index].good_count),
            };
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/wh2/${id}`, goodToSave, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEditingIndex2(-1);
            fetchWH2();
        } catch (error) {
            console.error("Error by saving: " + error);
            if (error.response) {
                setNotification(error.response.data);
                setTimeout( () => {
                    setNotification('');
                },3000)
            }
        }
    }

    const sortGoodsWH1 = (key) => {
        let direction = 'ASC';
        if (sortConfigWH1.key === key && sortConfigWH1.direction === 'ASC') {
            direction = 'DESC';
        }

        const sortedGoodsWH1 = [...wh1goods].sort((a,b) => {
            if (typeof a[key] === 'string') {
                return direction === 'ASC'
                ? a[key].localeCompare(b[key])
                : b[key].localeCompare(a[key]);
            } else {
                return direction === 'ASC' ? a[key] - b[key] : b[key] - a[key];
            }
        });

        setWH1Goods(sortedGoodsWH1);
        setSortConfigWH1({key, direction});
    }

    const sortGoodsWH2 = (key) => {
        let direction = 'ASC';
        if (sortConfigWH2.key === key && sortConfigWH2.direction === 'ASC') {
            direction = 'DESC';
        }

        const sortedGoodsWH2 = [...wh2goods].sort((a,b) => {
            if (typeof a[key] === 'string') {
                return direction === 'ASC'
                ? a[key].localeCompare(b[key])
                : b[key].localeCompare(a[key]);
            } else {
                return direction === 'ASC' ? a[key] - b[key] : b[key] - a[key];
            }
        });

        setWH2Goods(sortedGoodsWH2);
        setSortConfigWH2({key, direction});
    }

    const handleEdit = (index) => {
        setEditingIndex(index);
    }

    const handleEdit2 = (index) => {
        setEditingIndex2(index);
    }

    return (
        <div className="warehouses-page">
            <AdminHeader/>
            <div className="warehouses-page-container">
                {notification && <Notification message={notification} onClose={()=> setNotification('')}/>}
                <div className="warehouses-page-left">
                    <h2 className="header_h2">Склад 1</h2>
                    <hr></hr>
                    <AddGoods warehouseId={1} />
                    <table>
                        <thead>
                            <tr>
                                <th className='sortable' onClick={()=>{sortGoodsWH1('id')}}>ID{sortConfigWH1.key === 'id' && (sortConfigWH1.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th className='sortable' onClick={()=>{sortGoodsWH1('good_id')}}>ID товара{sortConfigWH1.key === 'good_id' && (sortConfigWH1.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th className='sortable' onClick={()=>{sortGoodsWH1('good_name')}}>Название товара{sortConfigWH1.key === 'good_name' && (sortConfigWH1.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th className='sortable' onClick={()=>{sortGoodsWH1('good_count')}}>Количество{sortConfigWH1.key === 'good_count' && (sortConfigWH1.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wh1goods.map((good, index) => (
                                <tr key={good.id}>
                                    <td>{good.id}</td>
                                    <td>{good.good_id}</td>
                                    <td>{good.good_name}</td>
                                    <td>
                                        {editingIndex === index ? (
                                            <input 
                                            type="number" 
                                            value={good.good_count}
                                            onChange={(e)=>{
                                                const updatedWH1goods = [...wh1goods];
                                                updatedWH1goods[index].good_count = e.target.value;
                                                setWH1Goods(updatedWH1goods);
                                            }}
                                            />
                                        ) : (
                                            good.good_count
                                        )}
                                    </td>
                                    <td>
                                        {editingIndex === index ? (
                                            <button onClick={()=>{handleSave_W1(good.id, index)}}><i className="fa-solid fa-circle-check"></i></button>
                                        ) : (
                                            <button onClick={()=>{handleEdit(index)}}><i className="fa-solid fa-pencil"></i></button>
                                        )}
                                        <button onClick={()=>{handleDelete_W1(good.id)}}><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <select 
                                        value={newGoodWH1.good_id}
                                        onChange={(e) => setNewGoodWH1({...newGoodWH1, good_id : e.target.value})}
                                    >
                                        <option value="">Выберите товар</option>
                                        {goodsw1.map((good) => (
                                            <option key={good.id} value={good.id}>
                                                {good.good_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input 
                                    type="number"
                                    value={newGoodWH1.good_count}
                                    placeholder='Количество'
                                    onChange={(e)=>{
                                        setNewGoodWH1({...newGoodWH1, good_count : e.target.value})
                                    }}
                                    />
                                </td>
                                <td><button onClick={handleAdd_W1}><i className="fa-solid fa-circle-plus"></i></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="warehouses-page-right">
                    <h2 className="header_h2">Склад 2</h2>
                    <hr></hr>
                    <AddGoods warehouseId={2} />
                    {notification && <Notification message={notification} onClose={()=> setNotification('')}/>}
                    <table>
                        <thead>
                            <tr>
                                <th className='sortable' onClick={()=>{sortGoodsWH2('id')}}>ID{sortConfigWH2.key === 'id' && (sortConfigWH2.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th className='sortable' onClick={()=>{sortGoodsWH2('good_id')}}>ID товара{sortConfigWH2.key === 'good_id' && (sortConfigWH2.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th className='sortable' onClick={()=>{sortGoodsWH2('good_name')}}>Название товара{sortConfigWH2.key === 'good_name' && (sortConfigWH2.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th className='sortable' onClick={()=>{sortGoodsWH2('good_count')}}>Количество{sortConfigWH2.key === 'good_count' && (sortConfigWH2.direction === 'ASC' ? '↑' : '↓')}</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wh2goods.map((good, index) => (
                                <tr key={good.id}>
                                    <td>{good.id}</td>
                                    <td>{good.good_id}</td>
                                    <td>{good.good_name}</td>
                                    <td>
                                        {editingIndex2 === index ? (
                                            <input 
                                            type="number" 
                                            value={good.good_count}
                                            onChange={(e)=>{
                                                const updatedWH2goods = [...wh2goods];
                                                updatedWH2goods[index].good_count = e.target.value;
                                                setWH2Goods(updatedWH2goods);
                                            }}
                                            />
                                        ) : (
                                            good.good_count
                                        )}
                                    </td>
                                    <td>
                                        {editingIndex2 === index ? (
                                            <button onClick={()=>{handleSave_W2(good.id, index)}}><i className="fa-solid fa-circle-check"></i></button>
                                        ) : (
                                            <button onClick={()=>{handleEdit2(index)}}><i className="fa-solid fa-pencil"></i></button>
                                        )}
                                        <button onClick={()=>{handleDelete_W2(good.id)}}><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <select 
                                        value={newGoodWH2.good_id}
                                        onChange={(e) => setNewGoodWH2({...newGoodWH2, good_id : e.target.value})}
                                    >
                                        <option value="">Выберите товар</option>
                                        {goodsw2.map((good) => (
                                            <option key={good.id} value={good.id}>
                                                {good.good_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input 
                                    type="number"
                                    value={newGoodWH2.good_count}
                                    placeholder='Количество'
                                    onChange={(e)=>{
                                        setNewGoodWH2({...newGoodWH2, good_count : e.target.value})
                                    }}
                                    />
                                </td>
                                <td><button onClick={handleAdd_W2}><i className="fa-solid fa-circle-plus"></i></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WarehousesPage;