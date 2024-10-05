import React, { useState } from 'react';
import axios from 'axios';

const AddGoods = ({ warehouseId }) => {
    const [goods, setGoods] = useState([{ good_id: '', good_count: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newGoods = [...goods];
        newGoods[index][name] = value;
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

        try {
            // Отправляем запрос с помощью axios
            const response = await axios.post(`/wadd${warehouseId}`, goods, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200) {
                throw new Error('Ошибка при добавлении товаров');
            }

            alert('Товары успешно добавлены!');
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Добавить товары на склад {warehouseId}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {goods.map((good, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                        <input
                            type="number"
                            name="good_id"
                            placeholder="ID товара"
                            value={good.good_id}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                            style={{ marginRight: '10px' }}
                        />
                        <input
                            type="number"
                            name="good_count"
                            placeholder="Количество"
                            value={good.good_count}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                            style={{ marginRight: '10px' }}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            disabled={goods.length === 1} // Не даем удалить последнюю строку
                            style={{ marginRight: '10px' }}
                        >
                            Удалить
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddRow}>
                    Добавить товар
                </button>
                <button type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
                    {loading ? 'Добавление...' : 'Отправить'}
                </button>
            </form>
        </div>
    );
};

export default AddGoods;
