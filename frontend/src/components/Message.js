import React from 'react';
import { Box } from '@mui/material';
import ChartComponent from './Chart';

function Message({ sender, text, chartData }) {
    const isBot = sender === 'bot';

    const messageStyle = {
        marginBottom: '10px',
        padding: '15px',
        borderRadius: '10px',
        maxWidth: '80%',
        alignSelf: isBot ? 'flex-start' : 'flex-end',
        textAlign: isBot ? 'left' : 'right',
        backgroundColor: isBot ? '#B0C4DE' : '#4682B4', // Darker navy blue for bot, lighter navy blue for user
        color: isBot ? '#fff' : '#fff',  // White text for both bot and user
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif', // Professional font choice
        fontSize: '14px', // Adjust font size as needed
        fontWeight: 400, // Normal weight, adjust as needed
        lineHeight: 1.5, // Adjust line height for readability
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        animation: 'fadeIn 0.3s ease',
    };

    const iconStyle = {
        position: 'absolute',
        top: '10px',
        left: isBot ? '10px' : 'auto',
        right: isBot ? 'auto' : '10px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#000', // Black circle background
        color: '#fff', // White text color
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
    };

    const triangleStyle = {
        position: 'absolute',
        width: '20px',
        height: '20px',
        backgroundColor: isBot ? '#1a237e' : '#3949ab', // Match message box color
        transform: isBot ? 'rotate(45deg)' : 'rotate(-45deg)',
        bottom: '-10px',
        left: isBot ? '10px' : 'auto',
        right: isBot ? 'auto' : '10px',
        zIndex: '-1',
    };

    const iconContent = isBot ? 'B' : 'U'; // Icon content ('B' for bot, 'U' for user)

    return (
        <Box style={messageStyle}>
            <div style={iconStyle}>{iconContent}</div>
            <span style={{ zIndex: '1', position: 'relative', marginLeft: isBot ? '30px' : '0', marginRight: isBot ? '0' : '30px' }}>{text}</span>
            {chartData && chartData.labels && chartData.labels.length > 0 && (
                <Box marginTop="10px" width="100%">
                    <ChartComponent chartData={chartData} />
                </Box>
            )}
            <div style={triangleStyle}></div>
        </Box>
    );
}

export default Message;
