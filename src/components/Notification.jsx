// src/components/Notification.jsx
import React, { useEffect } from 'react';

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Убираем уведомление через 3 секунды

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification">
            {message}
        </div>
    );
};

export default Notification;
