import React from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const navigate = useNavigate();


    const handleSubmit = async () => {
        navigate('/');
    }

    return (
        <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" />
            </div>
            <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
            </div>
            <button type="submit">Login</button>
        </form>
        </div>
    );
}

export default LoginPage