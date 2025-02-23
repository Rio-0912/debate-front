import React, { useState, useRef, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    TextField,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Paper,
    Button,
    Avatar,
    CircularProgress,
    ListItemIcon,
    Tooltip,
    useMediaQuery,
    Tab,
    Tabs,
    Stack,
    Fade,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    Send,
    Menu as MenuIcon,
    Add,
    Delete,
    ChatBubble,
    PushPin,
    Search,
    Person,
    Logout,
    SkipNext
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const darkTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#D3C5E5",
            light: "#E2D8EE",
            dark: "#B6A3C9"
        },
        secondary: {
            main: "#D3C5E5",
            light: "#E2D8EE",
            dark: "#B6A3C9"
        },
        background: {
            default: "rgba(211, 197, 229, 0.3)", // This is equivalent to bg-[#D3C5E5]/30
            paper: "rgba(211, 197, 229, 0.3)",
        },
        text: {
            primary: "#374151", // text-gray-700
            secondary: "#374151"
        },
        action: {
            active: "#D3C5E5",
            hover: "rgba(211, 197, 229, 0.08)",
            selected: "rgba(211, 197, 229, 0.16)",
        }
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontWeight: 900,
            color: "#374151",
        },
        h2: {
            fontWeight: 800,
            color: "#374151",
        },
        h4: {
            fontWeight: 700,
            color: "#374151",
        },
        h6: {
            color: "#374151",
        },
        body1: {
            color: "#374151",
        },
        caption: {
            color: "#374151",
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 28,
                    textTransform: "none",
                    backgroundColor: "#D3C5E5",
                    color: "#374151",
                    "&:hover": {
                        backgroundColor: "#B6A3C9",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "rgba(211, 197, 229, 0.3)",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "rgba(211, 197, 229, 0.3)",
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: "rgba(211, 197, 229, 0.3)",
                        '&:hover fieldset': {
                            borderColor: "#D3C5E5",
                        },
                    },
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: "rgba(211, 197, 229, 0.16)",
                        '&:hover': {
                            backgroundColor: "rgba(211, 197, 229, 0.24)",
                        },
                    },
                }
            }
        }
    },
});

const TypingEffect = ({ text, onComplete, onInterrupt }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [interrupted, setInterrupted] = useState(false);

    useEffect(() => {
        if (interrupted) {
            setDisplayText(text);
            onComplete();
            return;
        }

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(currentIndex + 1);
            }, 30);

            return () => clearTimeout(timeout);
        } else {
            onComplete();
        }
    }, [currentIndex, text, onComplete, interrupted]);

    const handleInterrupt = () => {
        setInterrupted(true);
        onInterrupt(); // Calls a function to update the messages state immediately
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>{displayText}</Typography>
            {!interrupted && (
                <IconButton size="small" onClick={handleInterrupt} sx={{ ml: 1 }}>
                    <SkipNext fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};

const LoggedIn = () => {
    const { logout } = useAuth();
    const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([
        { id: 1, title: "Previous Chat 1", messages: [], lastActive: new Date() },
        { id: 2, title: "Previous Chat 2", messages: [], lastActive: new Date() }
    ]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const messagesEndRef = useRef(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const openProfile = Boolean(profileAnchorEl);
    const user = localStorage.getItem("user");
    const [isTyping, setIsTyping] = useState(false);

    const handleSkip = () => {
        setIsTyping(false);
    };

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    const handleLogout = () => {
        handleProfileClose();
        logout();
    };

    const handleProfileNav = () => {
        handleProfileClose();
        // Add navigation to profile page here
        console.log("Navigate to profile");
    };


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: input,
            sender: "user",
            timestamp: new Date().toLocaleTimeString(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInput("");
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API delay

            const botResponse = {
                id: Date.now() + 1,
                text: "This is a bot response with a typing effect. You can interrupt this response using the skip button.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString(),
                isTyping: true,
            };

            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const createNewChat = () => {
        const newChat = {
            id: Date.now(),
            title: `New Chat ${history.length + 1}`,
            messages: [],
            pinned: false,
            lastActive: new Date()
        };
        setHistory([newChat, ...history]);
        setCurrentChat(newChat);
        setMessages([]);
        if (isMobile) setDrawerOpen(false);
    };

    const filteredHistory = history.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const MainAppBar = () => (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                {isMobile && (
                    <IconButton
                        edge="start"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )
                }
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {currentChat?.title || "AI Chat Assistant"}
                </Typography>
                <Tooltip title="Profile menu">
                    <IconButton
                        onClick={handleProfileClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openProfile ? 'profile-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openProfile ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                            }}
                            alt={user?.username}
                        />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="profile-menu"
                    anchorEl={profileAnchorEl}
                    open={openProfile}
                    onClose={handleProfileClose}
                    onClick={handleProfileClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleProfileNav}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar >
        </AppBar >
    );

    const SidebarContent = () => (
        <Box
            sx={{
                width: isMobile ? '100vw' : 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ px: 2, py: 1, mt: 3 }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Add />}
                    onClick={createNewChat}
                    sx={{ mb: 2 }}
                >
                    New Chat
                </Button>

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1 }} />,
                    }}
                    sx={{ mb: 2 }}
                />

                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    variant="fullWidth"
                    sx={{ mb: 2 }}
                >
                    <Tab label="All" />
                    <Tab label="Pinned" />
                </Tabs>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
            >
                <List>
                    {filteredHistory
                        .filter(chat => tabValue === 0 || (tabValue === 1 && chat.pinned))
                        .map((chat) => (
                            <ListItem
                                button
                                key={chat.id}
                                selected={currentChat?.id === chat.id}
                                sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    mx: 1,
                                }}
                            >
                                <ListItemIcon>
                                    <ChatBubble />
                                </ListItemIcon>
                                <ListItemText
                                    primary={chat.title}
                                    secondary={new Date(chat.lastActive).toLocaleDateString()}
                                />
                                <Stack direction="row" spacing={1}>
                                    {chat.pinned && (
                                        <PushPin fontSize="small" color="primary" />
                                    )}
                                    <IconButton size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </ListItem>
                        ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
                {!isMobile && (
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: 280,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: 280,
                                borderRight: 1,
                                borderColor: 'divider',
                            },
                        }}
                    >
                        <SidebarContent />
                    </Drawer>
                )}

                <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    sx={{
                        display: { sm: 'none' },
                    }}
                >
                    <SidebarContent />
                </Drawer>

                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <MainAppBar />
                    <Paper
                        sx={{
                            flexGrow: 1,
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            p: 2
                        }}
                    >
                        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                            {messages.map((msg) => (
                                <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                                    <Paper sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'transparent',
                                        boxShadow: msg.sender === 'user' ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none',
                                    }}>
                                        {msg.isTyping ? (
                                            <TypingEffect
                                                text={msg.text}
                                                onComplete={() => {
                                                    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isTyping: false } : m));
                                                }}
                                                onInterrupt={() => {
                                                    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isTyping: false } : m));
                                                }}
                                            />
                                        ) : (
                                            <Typography>{msg.text}</Typography>
                                        )}
                                    </Paper>
                                </Box>
                            ))}

                            <div ref={messagesEndRef} />
                        </Box>

                        {isLoading && (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Paper>

                    <Paper
                        sx={{
                            p: 2,
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                        elevation={0}
                    >
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                variant="outlined"
                                size="small"
                            />
                            <Tooltip title="Send message">
                                <span>
                                    <IconButton
                                        onClick={sendMessage}
                                        disabled={isLoading || !input.trim()}
                                    >
                                        <Send />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default LoggedIn;