import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RouteCalculator = () => {
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (startPoint && endPoint) {
            navigate('/map', { state: { startPoint, endPoint } });
        }
    };

    return (
        <div>
            <h2>Калькулятор маршруту</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Початкова точка:
                    <input
                        type="text"
                        value={startPoint}
                        onChange={(e) => setStartPoint(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Кінцева точка:
                    <input
                        type="text"
                        value={endPoint}
                        onChange={(e) => setEndPoint(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Розрахувати маршрут</button>
            </form>
        </div>
    );
};

export default RouteCalculator;
