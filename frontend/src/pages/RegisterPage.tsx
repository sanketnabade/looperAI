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
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { FormField } from '../components/FormField';

export const RegisterPage: React.FC = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [formError, setFormError] = React.useState('');

    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        try {
            await register(name, email, password);
            navigate('/dashboard');
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
                            Create your account
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                            Get started with your financial dashboard
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
                            {(error || formError) && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error || formError}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <FormField
                                        id="name"
                                        label="Full Name"
                                        type="text"
                                        isRequired
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
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
                                    <FormField
                                        id="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        isRequired
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        {isLoading ? 'Creating account...' : 'Create account'}
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>

                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        Already have an account?{' '}
                        <MuiLink
                            component={Link}
                            to="/login"
                            sx={{
                                color: '#00D4FF',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Sign in
                        </MuiLink>
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};
