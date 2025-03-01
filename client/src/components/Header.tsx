import React, { useEffect, useState } from 'react';
import './Header.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Toolbar, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginButton = styled(Button)({
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: '#45a049',
    },
});
const LogoutButton = styled(Button)({
    backgroundColor: '#f44336', 
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: '#d32f2f', 
    },
});

const Header: React.FC = () => {
    const navigate = useNavigate(); 
    const token = localStorage.getItem('auth_token');
    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleLogoutClick = () => {
        localStorage.removeItem('auth_token');
        toast.success('Successfully logged out');
        navigate('/login');

    };
    const handleHomeClick = () => {
        navigate('/');
    };




    return (
        <>
            <AppBar className="appBar"position="static">
                <Toolbar className="toolBar">
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Kanban Board
                    </Typography>
                    
                    <Button className="buttonSpacing" color="inherit" onClick={handleHomeClick}>Home</Button>
                    {token ? (
                        <>
                            <TextField
                            className="buttonSpacing searchBar" 
                            id="outlined-basic" 
                            label="Search" 
                            variant="outlined" 
                            placeholder='Search' 
                            sx={{
                                marginRight: '10px',
                                '& .MuiInputBase-input': {
                                    color: 'white', // Text color
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white', // Outline color
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white', // Outline color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white', // Outline color when focused
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white', // Label color
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white', // Label color when focused
                                },
                            }}
                            />
                            <LogoutButton className="buttonSpacing" onClick={handleLogoutClick}>Sign out</LogoutButton>
                        </>
                        
                    ) : (
                        <LoginButton className="buttonSpacing" onClick={handleLoginClick}>Sign in</LoginButton>
                    )}

                
                </Toolbar>
            </AppBar>
            <ToastContainer position="top-right" style={{ marginTop: '4rem' }}/>
        </>
    );
};

export default Header;