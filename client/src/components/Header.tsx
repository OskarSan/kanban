import React from 'react';
import './Header.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';


const LoginButton = styled(Button)({
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: '#45a049',
    },
});

const Header: React.FC = () => {
    return (
        <AppBar className="appBar"position="static">
            <Toolbar className="toolBar">
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Kanban Board
                </Typography>
                <Button className="buttonSpacing" color="inherit">Home</Button>
                <Button className="buttonSpacing" color="inherit">About</Button>
                <LoginButton>Login</LoginButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;