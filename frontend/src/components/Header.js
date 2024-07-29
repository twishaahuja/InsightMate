import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function Header({ toggleDrawer, startNewChat }) {
    return (
        <AppBar position="fixed" style={{ zIndex: 1201, backgroundColor: '#1a237e' }}>
            <Toolbar>
                <IconButton color="inherit" onClick={toggleDrawer} edge="start">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1, marginLeft: '10px' }}>InsightMate</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit">
                        <HelpOutlineIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <SettingsIcon />
                    </IconButton>
                    <Button color="inherit" onClick={startNewChat} variant="outlined" style={{ marginLeft: '10px', borderColor: '#ffffff', color: '#ffffff' }}>New Chat</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
