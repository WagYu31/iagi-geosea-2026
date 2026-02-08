import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTheme } from '@mui/material/styles';
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useThemeMode } from '../ThemeContext';

const drawerWidth = 270;
const collapsedDrawerWidth = 70;

function SidebarLayout({ children }) {
  const { auth, ziggy } = usePage().props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentRoute = ziggy?.location || '';
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';
  const c = theme.palette.custom;

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
    { text: 'Admin Dashboard', icon: <DashboardIcon />, href: route('admin.dashboard'), color: '#059669' },
    { text: 'Manage Submissions', icon: <ArticleIcon />, href: route('admin.submissions'), color: '#2563eb' },
    { text: 'Manage Payments', icon: <PaymentIcon />, href: route('admin.payments'), color: '#ea580c' },
    { text: 'Manage Users', icon: <PeopleIcon />, href: route('admin.users'), color: '#9333ea' },
    { text: 'Daftar Nilai', icon: <GradeIcon />, href: route('admin.scores'), color: '#ca8a04' },
    { text: 'Settings', icon: <SettingsIcon />, href: route('admin.settings'), color: '#0891b2' },
    { text: 'Email Settings', icon: <EmailIcon />, href: route('admin.email.settings.page'), color: '#db2777' },
    { text: 'Profile', icon: <PersonIcon />, href: route('profile.edit'), color: '#64748b' },
  ] : isReviewer ? [
    { text: 'Dashboard', icon: <DashboardIcon />, href: route('reviewer.dashboard'), color: '#059669' },
    { text: 'Assigned Submissions', icon: <ArticleIcon />, href: route('reviewer.submissions'), color: '#2563eb' },
    { text: 'Profile', icon: <PersonIcon />, href: route('profile.edit'), color: '#64748b' },
  ] : [
    { text: 'Dashboard', icon: <DashboardIcon />, href: route('dashboard'), color: '#059669' },
    { text: 'Submissions', icon: <ArticleIcon />, href: route('submissions.index'), color: '#2563eb' },
    { text: 'Payments', icon: <PaymentIcon />, href: route('payments.index'), color: '#ea580c' },
    { text: 'Profile', icon: <PersonIcon />, href: route('profile.edit'), color: '#64748b' },
  ];

  const isActive = (href) => {
    return currentRoute.includes(href.replace(window.location.origin, ''));
  };

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: c.sidebarBg,
    }}>
      {/* ─── Unified Header: Brand + User ─── */}
      <Box sx={{
        background: c.sidebarHeaderBg,
        p: isCollapsed ? 1.5 : 0,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '50%',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 80,
          height: 80,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '50%',
        },
      }}>
        {/* Brand Row */}
        <Box sx={{
          px: isCollapsed ? 0 : 2.5,
          py: isCollapsed ? 1.5 : 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 1.2,
          position: 'relative',
          zIndex: 1,
        }}>
          <Box
            component="img"
            src="/favicon.ico"
            alt="IAGI-GEOSEA"
            sx={{
              width: isCollapsed ? 36 : 34,
              height: isCollapsed ? 36 : 34,
              borderRadius: '10px',
              flexShrink: 0,
              objectFit: 'contain',
            }}
          />
          {!isCollapsed && (
            <Box>
              <Typography sx={{
                fontWeight: 800,
                fontSize: '0.95rem',
                color: 'white',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}>
                IAGI-GEOSEA
              </Typography>
              <Typography sx={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                Conference 2026
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─── Menu Label ─── */}
      {!isCollapsed && (
        <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
          <Typography sx={{
            fontSize: '0.6rem',
            fontWeight: 700,
            color: isDark ? '#6b7280' : '#b0b8c4',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Navigation
          </Typography>
        </Box>
      )}

      {/* ─── Menu Items ─── */}
      <List sx={{ px: isCollapsed ? 0.75 : 1.5, py: 0.5, flex: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const button = (
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{
                borderRadius: '12px',
                py: 1.1,
                px: isCollapsed ? 1 : 1.5,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                backgroundColor: active ? `${item.color}14` : 'transparent',
                border: active ? `1.5px solid ${item.color}30` : '1.5px solid transparent',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: active ? 3 : 0,
                  height: active ? '60%' : 0,
                  backgroundColor: item.color,
                  borderRadius: '0 4px 4px 0',
                  transition: 'all 0.3s ease',
                },
                '&:hover': {
                  backgroundColor: active ? `${item.color}1a` : (isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa'),
                  transform: !isCollapsed ? 'translateX(3px)' : 'none',
                },
              }}
            >
              <ListItemIcon sx={{
                color: active ? item.color : (isDark ? '#9ca3af' : '#9ca3af'),
                minWidth: isCollapsed ? 'auto' : 38,
                justifyContent: 'center',
                '& .MuiSvgIcon-root': { fontSize: 22 },
                transition: 'color 0.2s ease',
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? item.color : (isDark ? '#d1d5db' : '#4b5563'),
                    letterSpacing: '-0.01em',
                    transition: 'all 0.2s ease',
                  }}
                />
              )}
              {active && !isCollapsed && (
                <Box sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: item.color,
                  boxShadow: `0 0 8px ${item.color}80`,
                  flexShrink: 0,
                }} />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.4 }}>
              {isCollapsed ? (
                <Tooltip title={item.text} placement="right">{button}</Tooltip>
              ) : button}
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: isCollapsed ? 1 : 2, borderColor: isDark ? '#2d3748' : '#f0f0f0' }} />

      {/* ─── Logout ─── */}
      <List sx={{ px: isCollapsed ? 0.75 : 1.5, py: 1.5 }}>
        <ListItem disablePadding>
          {isCollapsed ? (
            <Tooltip title="Logout" placement="right">
              <ListItemButton
                component={Link}
                href={route('logout')}
                method="post"
                sx={{
                  borderRadius: '12px',
                  py: 1.1,
                  px: 1,
                  justifyContent: 'center',
                  bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fff5f5',
                  border: isDark ? '1.5px solid rgba(239, 68, 68, 0.2)' : '1.5px solid #fed7d7',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                    borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5',
                  },
                }}
              >
                <ListItemIcon sx={{
                  color: '#ef4444',
                  minWidth: 'auto',
                  justifyContent: 'center',
                  '& .MuiSvgIcon-root': { fontSize: 22 },
                }}>
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
                borderRadius: '12px',
                py: 1.1,
                px: 1.5,
                bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fff5f5',
                border: isDark ? '1.5px solid rgba(239, 68, 68, 0.2)' : '1.5px solid #fed7d7',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                  borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5',
                  transform: 'translateX(3px)',
                },
              }}
            >
              <ListItemIcon sx={{
                color: '#ef4444',
                minWidth: 38,
                '& .MuiSvgIcon-root': { fontSize: 22 },
              }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#ef4444',
                }}
              />
            </ListItemButton>
          )}
        </ListItem>
      </List>

      {/* ─── Footer ─── */}
      {!isCollapsed && (
        <Box sx={{ px: 2, pb: 2, pt: 0.5, textAlign: 'center' }}>
          <Typography sx={{ color: isDark ? '#4b5563' : '#d1d5db', fontSize: '0.6rem', fontWeight: 500 }}>
            © 2026 PIT IAGI-GEOSEA
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          background: c.appBarBg,
          backdropFilter: 'blur(16px)',
          color: c.textPrimary,
          boxShadow: 'none',
          borderBottom: `1px solid ${c.appBarBorder}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop collapse toggle */}
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={handleCollapseToggle}
            sx={{
              mr: 2,
              display: { xs: 'none', sm: 'flex' },
              width: 34,
              height: 34,
              borderRadius: '10px',
              border: `1.5px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              bgcolor: isDark ? '#1f2937' : '#fafbfc',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: isDark ? '#374151' : '#f3f4f6',
                borderColor: isDark ? '#4b5563' : '#d1d5db',
              },
            }}
          >
            {isCollapsed ? <ChevronRightIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
          </IconButton>

          <Box sx={{ flex: 1 }} />

          {/* Dark Mode Toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleMode}
              sx={{
                mr: 1.5,
                width: 36,
                height: 36,
                borderRadius: '10px',
                border: `1.5px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                bgcolor: isDark ? '#1f2937' : '#fafbfc',
                color: isDark ? '#fbbf24' : '#6b7280',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: isDark ? '#374151' : '#f3f4f6',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  transform: 'rotate(20deg)',
                },
              }}
            >
              {isDark ? <LightModeRoundedIcon sx={{ fontSize: 18 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>

          {/* User info in top bar */}
          <Box
            component={Link}
            href={route('profile.edit')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              cursor: 'pointer',
              borderRadius: '12px',
              px: 1.5,
              py: 0.8,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: isDark ? '#1f2937' : '#f3f4f6',
              },
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary, lineHeight: 1.2 }}>
                {auth.user?.name}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, lineHeight: 1.2 }}>
                {auth.user?.email}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#0d7a6a',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(13, 122, 106, 0.2)',
              }}
              variant="rounded"
            >
              {auth.user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: currentDrawerWidth },
          flexShrink: { sm: 0 },
          transition: 'width 0.3s ease',
        }}
        aria-label="sidebar navigation"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
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
              borderRight: `1px solid ${isDark ? '#2d3748' : '#f0f0f0'}`,
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              bgcolor: c.sidebarBg,
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
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          backgroundColor: c.surfaceBg,
          minHeight: '100vh',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 } }} />
        {children}
      </Box>
    </Box>
  );
}

export default SidebarLayout;
