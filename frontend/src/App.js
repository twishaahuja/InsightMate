import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, TextField, Button, Paper, Divider, Box, useMediaQuery, CssBaseline, Chip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import './styles.css';
import Message from './components/Message';
import Header from './components/Header';
import { Grow } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#333333', // Dark gray
        },
        secondary: {
            main: '#f0f0f0', // Light gray
        },
        background: {
            paper: '#e8eaf6', // Very light navy blue
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif', // Professional font
        h6: {
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
    },
});

const drawerWidth = 280;

const initialSuggestedQuestions = [
    "Average salary by department",
    "Number of employees by department",
    "Total salary expenditure by department"
];

function App() {
    const [chats, setChats] = useState([[]]);
    const [currentChatIndex, setCurrentChatIndex] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [suggestedQuestions, setSuggestedQuestions] = useState(initialSuggestedQuestions);
    const [askedFirstQuestion, setAskedFirstQuestion] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const sendMessage = async (message) => {
        if (message.trim() === '') return;

        const userMessage = { id: Date.now() + Math.random(), sender: 'user', text: message };
        setChats((prevChats) => {
            const newChats = [...prevChats];
            newChats[currentChatIndex] = [...newChats[currentChatIndex], userMessage];
            return newChats;
        });

        try {
            const response = await axios.post('http://localhost:5000/api/query', { question: message });
            const botMessage = {
                id: Date.now() + Math.random(),
                sender: 'bot',
                text: response.data.answer,
                chartData: response.data.chart_data || { labels: [], data: [] }
            };
            setChats((prevChats) => {
                const newChats = [...prevChats];
                newChats[currentChatIndex] = [...newChats[currentChatIndex], botMessage];
                return newChats;
            });
            setSuggestedQuestions(response.data.suggested_questions || []);
            if (!askedFirstQuestion) {
                setAskedFirstQuestion(true); // User has asked their first question
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const deleteChat = (index) => {
        setChats((prevChats) => {
            const newChats = [...prevChats];
            newChats.splice(index, 1);
            return newChats;
        });
        if (currentChatIndex >= index && currentChatIndex > 0) {
            setCurrentChatIndex(currentChatIndex - 1);
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const startNewChat = () => {
        setChats((prevChats) => [...prevChats, []]);
        setCurrentChatIndex(chats.length);
        setSuggestedQuestions(initialSuggestedQuestions); // Reset suggested questions for new chat
        setAskedFirstQuestion(false); // Reset askedFirstQuestion for new chat
    };

    const getFirstUserMessages = (chats) => {
        return chats.map(chat => chat.find(message => message.sender === 'user'));
    };

    const handleSuggestedQuestionClick = (question) => {
        sendMessage(question);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="background.paper">
                <Header toggleDrawer={toggleDrawer} startNewChat={startNewChat} />
                <Box display="flex" flex={1} paddingTop="64px">
                    <PreviousQuestionsDrawer
                        chats={chats}
                        firstUserMessages={getFirstUserMessages(chats)}
                        setCurrentChatIndex={setCurrentChatIndex}
                        deleteChat={deleteChat}
                        drawerOpen={drawerOpen && !isMobile}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        flex={1}
                        style={{
                            transition: 'padding-left 0.3s',
                            paddingLeft: drawerOpen && !isMobile ? `${drawerWidth}px` : '0',
                        }}
                    >
                        <ChatWindow
                            messages={chats[currentChatIndex]}
                            sendMessage={sendMessage}
                            drawerOpen={drawerOpen && !isMobile}
                            suggestedQuestions={suggestedQuestions}
                            onSuggestedQuestionClick={handleSuggestedQuestionClick}
                            askedFirstQuestion={askedFirstQuestion}
                        />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

function PreviousQuestionsDrawer({ firstUserMessages, setCurrentChatIndex, deleteChat, drawerOpen }) {
    const handleDeleteChat = (index) => {
        deleteChat(index);
    };

    return (
        <Paper
            elevation={3}
            style={{
                width: `${drawerWidth}px`,
                padding: '20px',
                display: drawerOpen ? 'block' : 'none',
                position: 'fixed',
                left: '0',
                top: '64px',
                bottom: '0',
                overflowY: 'auto',
                transition: 'width 0.3s, top 0.3s',
                backgroundColor: theme.palette.secondary.main,
            }}
        >
            <Typography variant="h6" style={{ marginBottom: '20px' }}>Previous Questions</Typography>
            <List>
                {firstUserMessages.map((message, index) => (
                    message ? (
                        <React.Fragment key={message.id}>
                            <ListItem button onClick={() => setCurrentChatIndex(index)}>
                                <ListItemText primary={`Chat ${index + 1}: ${message.text}`} />
                                <Button color="secondary" onClick={() => handleDeleteChat(index)}>
                                    <DeleteIcon style={{ color: '#666' }} />
                                </Button>
                            </ListItem>
                            {index !== firstUserMessages.length - 1 && <Divider />}
                        </React.Fragment>
                    ) : null
                ))}
            </List>
        </Paper>
    );
}

function ChatWindow({ messages, sendMessage, drawerOpen, suggestedQuestions, onSuggestedQuestionClick, askedFirstQuestion }) {
    const [question, setQuestion] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (question.trim() === '') return;

        sendMessage(question);
        setQuestion('');
    };

    return (
        <Box overflowY="auto" flex={1} padding="20px" marginBottom={10} paddingLeft={drawerOpen ? '40px' : '200px'}>
            <Typography variant="h4" component="h3" align="center" style={{ marginBottom: '20px' }}>
                Welcome to the analytical chatbot!!
            </Typography>
            {messages.map((msg, index) => (
                <Grow key={msg.id} in={true} timeout={500}>
                    <div style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <Message sender={msg.sender} text={msg.text} chartData={msg.chartData} />
                    </div>
                </Grow>
            ))}
            <div ref={messagesEndRef} />
            {(!askedFirstQuestion && suggestedQuestions.length > 0) && (
                <Box padding="20px" bgcolor="background.paper" marginTop="80px" paddingLeft={drawerOpen ? '130px' : '200px'}>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}></Typography>
                    <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
                        {suggestedQuestions.map((question, index) => (
                            <Box key={index} bgcolor="#f0f0f0" borderRadius="100px" padding="15px" margin="5px">
                                <Chip
                                    label={question}
                                    onClick={() => onSuggestedQuestionClick(question)}
                                    sx={{ color: '#1a237e', cursor: 'pointer' }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="10px"
                bgcolor="background.paper"
                position="fixed"
                bottom="0"
                right="0"
                left={drawerOpen ? `${drawerWidth}px` : '0'}
                style={{ transition: 'left 0.3s' }}
            >
                <TextField
                    id="user-input"
                    label="Type a message..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputLabelProps={{
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                    InputProps={{
                        style: {
                            borderRadius: '20px',
                            backgroundColor: '#fff',
                            padding: '10px',
                        },
                    }}
                    style={{ marginRight: '10px', flex: 1 }}
                />
                <Button variant="contained" sx={{ backgroundColor: '#1a237e', color: '#fff' }} onClick={handleSubmit}>Ask</Button>
            </Box>
        </Box>
    );
}

export default App;
