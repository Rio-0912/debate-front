import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Tabs,
    Tab,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Email,
    Lock,
    Person,
    Visibility,
    VisibilityOff,
    Phone,
    Cake,
    Wc
} from '@mui/icons-material';
import background from '../assets/imgs/background.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';


const Login = ({ tabNumber }) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [tab, setTab] = useState(tabNumber || 0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: 0,
        gender: '',
        phone: 0,
    });

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/auth/login', loginData, { withCredentials: true });
            setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
            login(res.data.user);
            navigate('/home');
        } catch (err) {
            setSnackbar({ open: true, message: 'Login failed. Check credentials.', severity: 'error' });
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/auth/signup', {
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                email: signupData.email,
                password: signupData.password,
                age: signupData.age,
                gender: signupData.gender,
                phone: signupData.phone,
            }, { withCredentials: true });
            setSnackbar({ open: true, message: 'Signup successful! You can now login.', severity: 'success' });
            setSignupData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                age: 0,
                gender: '',
                phone: 0,
            });
            setTab(0);
        } catch (err) {
            if (err.response.status === 409) {
                setSnackbar({ open: true, message: 'Email already exists!', severity: 'error' });
            } else {
                setSnackbar({ open: true, message: 'Signup failed. Please try again.', severity: 'error' });
            }
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            backgroundColor: '#0A192F',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(10, 25, 47, 0.85)',
                zIndex: 1
            }
        }}>
            <Card sx={{
                width: { xs: '90%', sm: 800 },
                zIndex: 2,
                minWidth: 320,
                maxWidth: 500,
                mt: 8,
                backgroundColor: '#102A43',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                borderRadius: 4,
                paddingY: { xs: 2, sm: 3 },
                border: '1px solid rgba(179, 229, 252, 0.1)'
            }}>
                <CardContent sx={{
                    p: { xs: 2, sm: 3 },
                    maxHeight: { xs: '75vh', sm: '80vh' },
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#0A192F',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#1565C0',
                        borderRadius: '4px',
                    }
                }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontFamily: 'Inter, sans-serif',
                            color: '#B3E5FC'
                        }}
                    >
                        DebateHub
                    </Typography>
                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        variant="fullWidth"
                        sx={{
                            mb: 3,
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#1565C0',
                                height: 3
                            },
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                fontSize: '1rem',
                                textTransform: 'none',
                                color: '#E3F2FD',
                                '&.Mui-selected': {
                                    color: '#1E88E5'
                                }
                            }
                        }}
                    >
                        <Tab label="Login" />
                        <Tab label="Sign Up" />
                    </Tabs>
                    {tab === 0 && (
                        <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 2 }}>
                            <Typography variant="h5" align="center" gutterBottom sx={{ color: '#BBDEFB' }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" align="center" sx={{ mb: 3, color: '#E3F2FD' }}>
                                Please enter your details
                            </Typography>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                margin="normal"
                                required
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#1E88E5' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1565C0',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#E3F2FD',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#E3F2FD',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                        WebkitTextFillColor: '#E3F2FD',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                margin="normal"
                                required
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#1E88E5' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#1E88E5' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1565C0',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#E3F2FD',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#E3F2FD',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                        WebkitTextFillColor: '#E3F2FD',
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#1565C0',
                                    '&:hover': {
                                        backgroundColor: '#0D47A1',
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    )}

                    {tab === 1 && (
                        <Box component="form" onSubmit={handleSignupSubmit} sx={{ mt: 2 }}>
                            <Typography variant="h5" align="center" gutterBottom sx={{ color: '#BBDEFB' }}>
                                Create Account
                            </Typography>
                            <Typography variant="body2" align="center" sx={{ mb: 3, color: '#E3F2FD' }}>
                                Please fill in your information
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    margin="normal"
                                    required
                                    value={signupData.firstName}
                                    onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: '#1E88E5' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1565C0',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#E3F2FD',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: '#E3F2FD',
                                        },
                                        '& input:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                            WebkitTextFillColor: '#E3F2FD',
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    margin="normal"
                                    required
                                    value={signupData.lastName}
                                    onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: '#1E88E5' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1565C0',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#E3F2FD',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: '#E3F2FD',
                                        },
                                        '& input:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                            WebkitTextFillColor: '#E3F2FD',
                                        },
                                    }}
                                />
                            </Box>

                            {/* Remaining fields with consistent dark theme styling */}
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                margin="normal"
                                required
                                value={signupData.email}
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#1E88E5' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1565C0',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#E3F2FD',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#E3F2FD',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                        WebkitTextFillColor: '#E3F2FD',
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                margin="normal"
                                required
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#1E88E5' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#1E88E5' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1565C0',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#E3F2FD',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#E3F2FD',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                        WebkitTextFillColor: '#E3F2FD',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                type={showConfirmPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                margin="normal"
                                required
                                value={signupData.confirmPassword}
                                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#1E88E5' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                                sx={{ color: '#1E88E5' }}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1565C0',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#E3F2FD',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#E3F2FD',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                        WebkitTextFillColor: '#E3F2FD',
                                    },
                                }}
                            />

                            {/* Age, Gender, Phone Fields */}
                            <TextField
                                fullWidth
                                type="number"
                                label="Age"
                                margin="normal"
                                required
                                value={signupData.age}
                                onChange={(e) => setSignupData({ ...signupData, age: parseInt(e.target.value) })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: '#1E88E5' }}>
                                            <Cake />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1565C0',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#E3F2FD',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#E3F2FD',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                        WebkitTextFillColor: '#E3F2FD',
                                    },
                                }}
                            />

                            <FormControl
                                fullWidth
                                margin="normal"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(179, 229, 252, 0.2)' },
                                        '&:hover fieldset': { borderColor: '#1565C0' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#E3F2FD' },
                                    '& .MuiSelect-select': { color: '#E3F2FD' }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: '#1E88E5' }}>
                                            <Phone />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <InputLabel sx={{ color: '#E3F2FD' }}>Gender</InputLabel>
                                <Select
                                    value={signupData.gender}
                                    onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                                    label="Gender"
                                    startAdornment={
                                        <InputAdornment position="start" sx={{ color: '#1E88E5' }}>
                                            <Wc />
                                        </InputAdornment>
                                    }
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: '#102A43',
                                                color: '#E3F2FD',
                                                '& .MuiMenuItem-root': {
                                                    '&:hover': { backgroundColor: '#1E88E5' }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                    <MenuItem value="Rather Not Say">Rather Not Say</MenuItem>
                                </Select>
                            </FormControl>


                            <TextField
                                fullWidth
                                type="tel"
                                label="Phone"
                                margin="normal"
                                required
                                value={signupData.phone}
                                onChange={(e) => setSignupData({ ...signupData, phone: parseInt(e.target.value) })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: '#1E88E5' }}>
                                            <Phone />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'hsla(199, 92.40%, 84.50%, 0.20)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1565C0',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#E3F2FD',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#E3F2FD',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0px 1000px #112A43 inset',
                                        WebkitTextFillColor: '#E3F2FD',
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#1565C0',
                                    '&:hover': {
                                        backgroundColor: '#0D47A1',
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;
