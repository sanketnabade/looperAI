import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    AccountBalanceWallet,
    SwapHoriz,
    Analytics,
    Person,
    Message,
    Settings,
    Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface LayoutProps {
    children: React.ReactNode;
}

const DRAWER_WIDTH = 240;

const menuItems = [
    { text: 'Dashboard', icon: Dashboard, path: '/dashboard' },
    { text: 'Transactions', icon: SwapHoriz, path: '/transactions' },
    { text: 'Wallet', icon: AccountBalanceWallet, path: '/wallet' },
    { text: 'Analytics', icon: Analytics, path: '/analytics' },
    { text: 'Personal', icon: Person, path: '/personal' },
    { text: 'Message', icon: Message, path: '/message' },
    { text: 'Setting', icon: Settings, path: '/settings' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Get page title based on current route
    const getPageTitle = () => {
        const menuItem = menuItems.find(item => item.path === location.pathname);
        return menuItem ? menuItem.text : 'Dashboard';
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleProfileMenuClose();
        navigate('/login');
    };

    const drawer = (
        <Box sx={{ height: '100%', backgroundColor: '#1E293B' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <img
                    src="/Logo.svg"
                    alt="Penta Logo"
                    style={{
                        width: 96,
                        height: 96,
                    }}
                />
            </Box>

            <List sx={{ px: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                color: location.pathname === item.path ? '#00D4FF' : '#CBD5E1',
                                backgroundColor: location.pathname === item.path ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: location.pathname === item.path ? '#00D4FF' : '#CBD5E1',
                                    minWidth: 40,
                                }}
                            >
                                <item.icon />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontSize: '0.875rem',
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    backgroundColor: '#1E293B',
                    boxShadow: 'none',
                    borderBottom: '1px solid #334155',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {getPageTitle()}
                    </Typography>

                    {/* Search box would go here */}

                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        sx={{ ml: 2 }}
                    >
                        <Avatar
                            src={(user as any)?.profile}
                            alt={user?.name}
                            sx={{ width: 32, height: 32 }}
                        >
                            {user?.name?.[0]}
                        </Avatar>
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                    >
                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1 }} />
                            Sign out
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            border: 'none',
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            border: 'none',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: '100vh',
                    backgroundColor: '#0F172A',
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};
