import React from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Card,
    CardContent,
    Link as MuiLink,
    Alert,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { FormField } from '../components/FormField';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    React.useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (error) {
            // Error is handled by the store
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3,
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={4} alignItems="center">
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <img
                            src="/Logo.svg"
                            alt="Penta Logo"
                            style={{
                                width: 96,
                                height: 96,
                            }}
                        />
                    </Box>

                    <Stack spacing={2} sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                            Sign in to continue to your dashboard
                        </Typography>
                    </Stack>

                    <Card
                        sx={{
                            width: '100%',
                            backgroundColor: '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: 3,
                            boxShadow: 'none',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <FormField
                                        id="email"
                                        label="Email"
                                        type="email"
                                        isRequired
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <FormField
                                        id="password"
                                        label="Password"
                                        type="password"
                                        isRequired
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={isLoading}
                                        sx={{
                                            backgroundColor: '#00D4FF',
                                            color: 'white',
                                            fontWeight: 600,
                                            py: 1.5,
                                            '&:hover': {
                                                backgroundColor: '#0099B2',
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#334155',
                                                color: '#94A3B8',
                                            },
                                        }}
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign in'}
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>

                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        Don't have an account?{' '}
                        <MuiLink
                            component={Link}
                            to="/register"
                            sx={{
                                color: '#00D4FF',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Sign up
                        </MuiLink>
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};
