import React, { useEffect, useState } from 'react';
import { Link, useLocation} from 'react-router-dom';
import logo from '../pages/AdminPage/logo.png'; 
const UserHeader = () => {
    const location = useLocation();
    const [role, setRole] = useState('');

    const handleRole = () => {
        const role = localStorage.getItem('role');
        setRole(role);
    }

    useEffect(() => {
        handleRole();
    }, []);
    return (
        <header className="admin-header">
            <span>
                <img src={logo} alt="Logo" draggable="false" />
                <h1>User Dashboard</h1>
            </span>
            <div className="admin-controls">
                <Link to="/user" className={location.pathname === '/user' ? 'active' : ''}>Главная</Link>
                <Link to="/goods" className={location.pathname === '/goods' ? 'active' : ''}>Товары</Link>
                <Link to="/sales" className={location.pathname === '/sales' ? 'active' : ''}>Заявки</Link>
                <Link to="/warehouses" className={location.pathname === '/warehouses' ? 'active' : ''}>Склады</Link>
                <button style={{ marginLeft: '20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 10px' }}>
                    <Link to="/"><i class="fa-solid fa-door-open"></i></Link>
                </button>
            </div>
        </header>
    );
};

export default UserHeader;
