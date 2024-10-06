import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddGoods = ({ warehouseId, onGoodsAdded }) => {
    const [goods, setGoods] = useState([{ good_id: '', good_count: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableGoods, setAvailableGoods] = useState([]);

    useEffect(() => {
        fetchGoods();
    }, [warehouseId]);

    const aggregateGoods = (goods) => {
        const aggregatedGoods = {};

        goods.forEach(({ good_id, good_count }) => {
            if (aggregatedGoods[good_id]) {
                aggregatedGoods[good_id] += parseInt(good_count, 10);
            } else {
                aggregatedGoods[good_id] = parseInt(good_count, 10);
            }
        });

        return Object.entries(aggregatedGoods).map(([good_id, good_count]) => ({
            good_id,
            good_count,
        }));
    };

    const fetchGoods = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/wh/${warehouseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setAvailableGoods(response.data);
        } catch (error) {
            console.error('Error fetching goods: ', error);
        }
    };


    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newGoods = [...goods];
        newGoods[index][name] = name === 'good_id' ? Number(value) : value;
        setGoods(newGoods);
    };

    const handleAddRow = () => {
        setGoods([...goods, { good_id: '', good_count: '' }]);
    };

    const handleRemoveRow = (index) => {
        const newGoods = goods.filter((_, i) => i !== index);
        setGoods(newGoods);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formattedGoods = goods.map(item => ({
            good_id: Number(item.good_id),
            good_count: parseInt(item.good_count, 10),
        }));

        console.log('Отправляемые данные:', JSON.stringify(formattedGoods, null, 2)); 

        try {
            const token = localStorage.getItem('token');
            const aggregatedGoods = aggregateGoods(formattedGoods); 

            const response = await axios.post(`http://localhost:8000/wadd/${warehouseId}`, 
                JSON.stringify(aggregatedGoods), 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status !== 201) {
                throw new Error('Ошибка при добавлении товаров');
            }
            alert('Товары успешно добавлены!');
            onGoodsAdded();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-goods-container">
            <h2 className="add-goods-title" id="h2h2">Приемка товаров</h2>
            <p>Приемка товаров осуществляется в 8:00 по местному времени от зарегистрированных поставщиков. После получения накладной, необходимо внести с нее данные в систему и удостовериться в пополнении складовой базы.</p>
            {error && <p className="add-goods-error">{error}</p>}
            <form onSubmit={handleSubmit} className="add-goods-form">
                {goods.map((good, index) => (
                    <div key={index} className="add-goods-row">
                        <select
                            name="good_id"
                            value={good.good_id}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                            className="add-goods-input"
                        >
                            <option value="" disabled>Выберите товар</option>
                            {availableGoods.map(item => (
                                <option key={item.good_id} value={item.good_id}>
                                    {item.good_name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="good_count"
                            placeholder="Количество"
                            value={good.good_count}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                            className="add-goods-input" 
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            disabled={goods.length === 1}
                            className="add-goods-input"
                        >
                            Удалить
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddRow} className="add-goods-button">
                    Добавить товар
                </button>
                <button type="submit" disabled={loading} className="add-goods-button" style={{ marginLeft: '10px' }}>
                    {loading ? 'Добавление...' : 'Отправить'}
                </button>
            </form>
        </div>
    );
};

export default AddGoods;
