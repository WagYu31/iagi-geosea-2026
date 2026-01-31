import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import GradeIcon from '@mui/icons-material/Grade';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import theme from '../theme';

const drawerWidth = 280;
const collapsedDrawerWidth = 70;

function SidebarLayout({ children }) {
  const { auth, ziggy } = usePage().props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentRoute = ziggy?.location || '';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const currentDrawerWidth = isCollapsed ? collapsedDrawerWidth : drawerWidth;

  const isAdmin = auth.user?.role?.toLowerCase() === 'admin';
  const isReviewer = auth.user?.role?.toLowerCase() === 'reviewer';

  const menuItems = isAdmin ? [
    {
      text: 'Admin Dashboard',
      icon: <DashboardIcon />,
      href: route('admin.dashboard'),
      color: '#059669',
    },
    {
      text: 'Manage Submissions',
      icon: <ArticleIcon />,
      href: route('admin.submissions'),
      color: '#2563eb',
    },
    {
      text: 'Manage Payments',
      icon: <PaymentIcon />,
      href: route('admin.payments'),
      color: '#ea580c',
    },
    {
      text: 'Manage Users',
      icon: <PeopleIcon />,
      href: route('admin.users'),
      color: '#9333ea',
    },
    {
      text: 'Daftar Nilai',
      icon: <GradeIcon />,
      href: route('admin.scores'),
      color: '#ca8a04',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      href: route('admin.settings'),
      color: '#0891b2',
    },
    {
      text: 'Email Settings',
      icon: <EmailIcon />,
      href: route('admin.email.settings.page'),
      color: '#db2777',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      href: route('profile.edit'),
      color: '#64748b',
    },
  ] : isReviewer ? [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      href: route('reviewer.dashboard'),
      color: '#059669',
    },
    {
      text: 'Assigned Submissions',
      icon: <ArticleIcon />,
      href: route('reviewer.submissions'),
      color: '#2563eb',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      href: route('profile.edit'),
      color: '#64748b',
    },
  ] : [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      href: route('dashboard'),
      color: '#059669',
    },
    {
      text: 'Submissions',
      icon: <ArticleIcon />,
      href: route('submissions.index'),
      color: '#2563eb',
    },
    {
      text: 'Payments',
      icon: <PaymentIcon />,
      href: route('payments.index'),
      color: '#ea580c',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      href: route('profile.edit'),
      color: '#64748b',
    },
  ];

  const isActive = (href) => {
    return currentRoute.includes(href.replace(window.location.origin, ''));
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Logo */}
      {!isCollapsed && (
        <Box sx={{
          background: 'linear-gradient(135deg, #006838 0%, #00845c 100%)',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }
        }}>
          <Box sx={{ lineHeight: 1.3 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                color: 'white',
                position: 'relative',
                zIndex: 1,
                letterSpacing: '0.5px',
                mb: 0.5
              }}
            >
              PIT IAGI-GEOSEA
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                color: 'white',
                position: 'relative',
                zIndex: 1,
                letterSpacing: '0.5px',
                mb: 0.5
              }}
            >
              2026
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Conference Management
          </Typography>
        </Box>
      )}

      {/* Collapsed Header */}
      {isCollapsed && (
        <Box sx={{
          background: 'linear-gradient(135deg, #006838 0%, #00845c 100%)',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'white',
              letterSpacing: '1px',
            }}
          >
            IA
          </Typography>
        </Box>
      )}

      {/* User Info Card */}
      {!isCollapsed && (
        <Box sx={{ p: 2.5, pb: 2 }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #f8faf9 0%, #ffffff 100%)',
            borderRadius: 3,
            p: 2,
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: '#006838',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              {auth.user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#1f2937',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {auth.user?.name}
              </Typography>
              <Chip
                label={auth.user?.role || 'User'}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  bgcolor: isAdmin ? '#dcfce7' : isReviewer ? '#dbeafe' : '#f3f4f6',
                  color: isAdmin ? '#16a34a' : isReviewer ? '#2563eb' : '#64748b',
                  mt: 0.5,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Collapsed User Avatar */}
      {isCollapsed && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={auth.user?.name} placement="right">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#006838',
                fontWeight: 700,
              }}
            >
              {auth.user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      <Divider sx={{ mx: isCollapsed ? 1 : 2, borderColor: '#e5e7eb' }} />

      {/* Menu Items */}
      <List sx={{ px: isCollapsed ? 1 : 2, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const button = (
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{
                borderRadius: 2,
                py: 1.25,
                px: isCollapsed ? 1 : 2,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                backgroundColor: active ? `${item.color}15` : 'transparent',
                border: active ? `1px solid ${item.color}40` : '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: active ? `${item.color}20` : `${item.color}08`,
                  transform: isCollapsed ? 'scale(1.05)' : 'translateX(4px)',
                  border: `1px solid ${item.color}30`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? item.color : '#64748b',
                  minWidth: isCollapsed ? 'auto' : 40,
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? item.color : '#475569',
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
              {isCollapsed ? (
                <Tooltip title={item.text} placement="right">
                  {button}
                </Tooltip>
              ) : button}
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: isCollapsed ? 1 : 2, borderColor: '#e5e7eb' }} />

      {/* Logout Button */}
      <List sx={{ px: isCollapsed ? 1 : 2, py: 2 }}>
        <ListItem disablePadding>
          {isCollapsed ? (
            <Tooltip title="Logout" placement="right">
              <ListItemButton
                component={Link}
                href={route('logout')}
                method="post"
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: 1,
                  justifyContent: 'center',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#fee2e2',
                    transform: 'scale(1.05)',
                    border: '1px solid #fca5a5',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#dc2626', minWidth: 'auto', justifyContent: 'center' }}>
                  <LogoutIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          ) : (
            <ListItemButton
              component={Link}
              href={route('logout')}
              method="post"
              sx={{
                borderRadius: 2,
                py: 1.25,
                px: 2,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#fee2e2',
                  transform: 'translateX(4px)',
                  border: '1px solid #fca5a5',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#dc2626', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#dc2626',
                }}
              />
            </ListItemButton>
          )}
        </ListItem>
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#94a3b8',
            fontSize: '0.7rem'
          }}
        >
          {isCollapsed ? 'Â©' : 'Â© 2026 PIT IAGI-GEOSEA'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
            ml: { sm: `${currentDrawerWidth}px` },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: theme.palette.primary.main,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Collapse Toggle Button for Desktop */}
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              onClick={handleCollapseToggle}
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'block' },
                '&:hover': {
                  backgroundColor: 'rgba(0, 104, 56, 0.08)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              Welcome, {auth.user?.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{
            width: { sm: currentDrawerWidth },
            flexShrink: { sm: 0 },
            transition: 'width 0.3s ease',
          }}
          aria-label="mailbox folders"
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                background: '#FFFFFF',
                borderRight: '1px solid #e5e7eb',
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: currentDrawerWidth,
                background: '#FFFFFF',
                borderRight: '1px solid #e5e7eb',
                transition: 'width 0.3s ease',
                overflowX: 'hidden',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SidebarLayout;

