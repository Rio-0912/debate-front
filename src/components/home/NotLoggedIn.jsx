import React, { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
    useScrollTrigger,
    ThemeProvider,
    createTheme,
    useMediaQuery,
    IconButton,
    Card,
    CardContent,
    TextField,
    InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ChatIcon from "@mui/icons-material/Chat";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GavelIcon from "@mui/icons-material/Gavel";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1565C0", // Deeper dark blue
        },
        secondary: {
            main: "#1E88E5", // Slightly lighter blue
        },
        background: {
            default: "#0A192F", // Dark navy blue
            paper: "#102A43", // Darker blue for contrast
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontWeight: 900,
            color: "#B3E5FC", // Light blue accent
        },
        h2: {
            fontWeight: 800,
            color: "#BBDEFB", // Soft blue for headings
        },
        h4: {
            fontWeight: 700,
        },
        body1: {
            color: "#E3F2FD", // Light blue text for readability
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 28,
                    textTransform: "none",
                    backgroundColor: "#1565C0",
                    "&:hover": {
                        backgroundColor: "#0D47A1", // Darker blue hover
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
    },
});

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);
const MotionTypography = motion.create(Typography);

const NotLoggedIn = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const isMobile = useMediaQuery(darkTheme.breakpoints.down("sm"));

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    const features = [
        {
            icon: <PsychologyIcon sx={{ fontSize: 48 }} color="primary" />,
            title: "Critical Thinking",
            description: "Develop advanced analytical and reasoning skills through structured debate practices",
            color: "#2196f3",
        },
        {
            icon: <ChatIcon sx={{ fontSize: 48 }} color="secondary" />,
            title: "Persuasive Speaking",
            description: "Master the art of compelling argumentation and public speaking",
            color: "#f50057",
        },
        {
            icon: <LightbulbIcon sx={{ fontSize: 48 }} color="warning" />,
            title: "Quick Thinking",
            description: "Learn to think and respond on your feet in high-pressure situations",
            color: "#ff9800",
        },
    ];

    const stats = [
        { icon: <PersonIcon />, value: "5000+", label: "Active Users" },
        { icon: <SchoolIcon />, value: "200+", label: "Universities" },
        { icon: <TimelineIcon />, value: "98%", label: "Success Rate" },
        { icon: <EmojiEventsIcon />, value: "150+", label: "Tournaments" },
    ];

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh", overflow: "hidden" }}>
                {/* Navigation */}
                <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: "blur(10px)" }}>
                    <Toolbar>
                        <MotionBox
                            component={motion.div}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
                        >
                            <GavelIcon sx={{ mr: 2, color: "primary.main" }} />
                            <Typography variant="h6" component="div" color="primary">
                                DebateHub
                            </Typography>
                        </MotionBox>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => navigate("/login")}
                                sx={{
                                    background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
                                    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 6px 10px 4px rgba(33, 203, 243, .3)",
                                    },
                                }}
                            >
                                Login
                            </Button>
                        </motion.div>
                    </Toolbar>
                </AppBar>

                {/* Hero Section */}
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        background: "radial-gradient(circle at top right, rgba(33, 150, 243, 0.1), transparent)",
                        pt: 8,
                    }}
                >
                    <Container>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <MotionBox
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <Typography
                                        variant="h2"
                                        gutterBottom
                                        sx={{
                                            fontSize: { xs: "2.5rem", md: "3.75rem" },
                                            background: "linear-gradient(45deg, #2196f3, #21CBF3)",
                                            backgroundClip: "text",
                                            WebkitBackgroundClip: "text",
                                            color: "transparent",
                                            mb: 3,
                                        }}
                                    >
                                        Master the Art of Debate
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="text.secondary"
                                        sx={{ mb: 4 }}
                                        component={motion.p}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Elevate your critical thinking and persuasive speaking skills through
                                        structured debate practice and real-time feedback.
                                    </Typography>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => navigate("/login")}
                                            sx={{
                                                px: 4,
                                                py: 2,
                                                fontSize: "1.1rem",
                                                background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
                                                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 6px 10px 4px rgba(33, 203, 243, .3)",
                                                },
                                            }}
                                        >
                                            Start Your Journey
                                        </Button>
                                    </motion.div>
                                </MotionBox>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MotionBox
                                    component={motion.div}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    sx={{
                                        position: "relative",
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: "-20%",
                                            right: "-20%",
                                            width: "140%",
                                            height: "140%",
                                            background: "radial-gradient(circle, rgba(33, 150, 243, 0.1), transparent)",
                                            zIndex: -1,
                                        },
                                    }}
                                >
                                    <img
                                        src="/api/placeholder/600/400"
                                        alt="Debate"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: "20px",
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                        }}
                                    />
                                </MotionBox>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Stats Section */}
                <Container sx={{ py: 8 }}>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Grid container spacing={4} justifyContent="center">
                            {stats.map((stat, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <MotionPaper
                                        variants={cardVariants}
                                        sx={{
                                            p: 3,
                                            textAlign: "center",
                                            background: "linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(33, 203, 243, 0.1))",
                                            borderRadius: 4,
                                        }}
                                    >
                                        <IconButton
                                            sx={{
                                                mb: 2,
                                                color: "primary.main",
                                                "&:hover": { background: "transparent" },
                                            }}
                                            disableRipple
                                        >
                                            {stat.icon}
                                        </IconButton>
                                        <Typography variant="h4" sx={{ mb: 1 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </MotionPaper>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>

                {/* Features Section */}
                <Container sx={{ py: 8 }}>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Grid container spacing={4}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <MotionPaper
                                        variants={cardVariants}
                                        sx={{
                                            p: 4,
                                            height: "100%",
                                            background: `linear-gradient(45deg, ${feature.color}15, transparent)`,
                                            borderRadius: 4,
                                            position: "relative",
                                            overflow: "hidden",
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: `linear-gradient(45deg, ${feature.color}05, transparent)`,
                                                transform: "translateY(100%)",
                                                transition: "transform 0.3s ease-in-out",
                                            },
                                            "&:hover::before": {
                                                transform: "translateY(0)",
                                            },
                                            "&:hover": {
                                                transform: "translateY(-8px)",
                                            },
                                            transition: "transform 0.3s ease-in-out",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                textAlign: "center",
                                            }}
                                        >
                                            {feature.icon}
                                            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </MotionPaper>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>

                {/* About Section */}
                <Container sx={{ py: 8 }}>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <MotionPaper
                            variants={cardVariants}
                            sx={{
                                p: { xs: 4, md: 6 },
                                background: "linear-gradient(45deg, rgba(33, 150, 243, 0.05), rgba(33, 203, 243, 0.05))",
                                borderRadius: 4,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Typography
                                        variant="h4"
                                        gutterBottom
                                        sx={{
                                            background: "linear-gradient(45deg, #2196f3, #21CBF3)",
                                            backgroundClip: "text",
                                            WebkitBackgroundClip: "text",
                                            color: "transparent",
                                        }}
                                    >
                                        About Competitive Debating
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        paragraph
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.8 }}
                                    >
                                        Competitive debating is a highly complex activity that involves
                                        formulating logical, persuasive arguments on a given topic while
                                        responding dynamically to counterarguments from opponents.
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.8 }}
                                    >
                                        Debaters must quickly understand nuanced topics, craft coherent and
                                        compelling arguments, and think critically on their feet. This
                                        process requires not only an understanding of the subject matter but
                                        also the ability to engage in logical reasoning, rhetorical
                                        persuasion, and counter-argumentation.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                                    <MotionBox
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            minHeight: 300,
                                            position: "relative",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 3,
                                        }}
                                    >
                                        {/* Achievement Cards */}
                                        {[
                                            { title: "Global Impact", value: "International Reach" },
                                            { title: "Success Rate", value: "98% Improvement" },
                                            { title: "Expert Mentors", value: "Top Debaters" }
                                        ].map((achievement, index) => (
                                            <Paper
                                                key={index}
                                                component={motion.div}
                                                whileHover={{ scale: 1.02 }}
                                                sx={{
                                                    p: 2,
                                                    background: "linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(33, 203, 243, 0.1))",
                                                    borderRadius: 2,
                                                    border: "1px solid rgba(33, 150, 243, 0.1)",
                                                }}
                                            >
                                                <Typography variant="h6" color="primary">
                                                    {achievement.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {achievement.value}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </MotionBox>
                                </Grid>
                            </Grid>
                        </MotionPaper>
                    </motion.div>
                </Container>

                {/* CTA Section */}
                <Container sx={{ py: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Paper
                            sx={{
                                p: { xs: 4, md: 8 },
                                textAlign: "center",
                                background: "linear-gradient(45deg, #0a1929, #0d2137)",
                                borderRadius: 4,
                                position: "relative",
                                overflow: "hidden",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: "radial-gradient(circle at center, rgba(33, 150, 243, 0.1), transparent)",
                                    zIndex: 0,
                                },
                            }}
                        >
                            <Box sx={{ position: "relative", zIndex: 1 }}>
                                <Typography
                                    variant="h3"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        background: "linear-gradient(45deg, #2196f3, #21CBF3)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        color: "transparent",
                                        mb: 3,
                                    }}
                                >
                                    Ready to Begin Your Journey?
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
                                >
                                    Join thousands of successful debaters who have mastered the art of
                                    persuasive communication through our platform.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate("/login")}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        fontSize: "1.2rem",
                                        background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
                                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 10px 4px rgba(33, 203, 243, .3)",
                                        },
                                        transition: "all 0.3s ease-in-out",
                                    }}
                                >
                                    Get Started Now
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>
                </Container>

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        py: 4,
                        bgcolor: "background.paper",
                        mt: 8,
                    }}
                >
                    <Container>
                        <Grid container spacing={4} justifyContent="space-between">
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" gutterBottom>
                                    DebateHub
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Empowering the next generation of debaters through innovative
                                    learning and practice.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
                                <Typography variant="body2" color="text.secondary">
                                    © {new Date().getFullYear()} DebateHub. All rights reserved.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default NotLoggedIn;