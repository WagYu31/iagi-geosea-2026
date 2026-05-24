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
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedIcon from '@mui/icons-material/Verified';
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
    { text: 'Scores', icon: <GradeIcon />, href: route('admin.scores'), color: '#ca8a04' },
    { text: 'Certificates', icon: <GradeIcon />, href: route('admin.certificates'), color: '#7c3aed' },
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
    { text: 'Certificates', icon: <GradeIcon />, href: route('certificates.index'), color: '#7c3aed' },
    { text: 'Profile', icon: <PersonIcon />, href: route('profile.edit'), color: '#64748b' },
  ];

  const isActive = (href) => {
    return currentRoute.includes(href.replace(window.location.origin, ''));
  };

  // ─── Outline-style SVG icons to match Stitch mockup ───
  const OutlineDashboard = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
  const OutlineSubmissions = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="14" y2="12"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
    </svg>
  );
  const OutlinePayments = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
      <rect x="6" y="14" width="4" height="2" rx="0.5"/>
    </svg>
  );
  const OutlineProfile = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>
    </svg>
  );
  const OutlineScores = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"/>
    </svg>
  );
  const OutlinePeople = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3.5"/>
      <path d="M2 20c0-3 2.7-5.5 7-5.5s7 2.5 7 5.5"/>
      <circle cx="17.5" cy="8.5" r="2.5"/>
      <path d="M18 14.5c2.5.3 4 2 4 4"/>
    </svg>
  );
  const OutlineSettings = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
  const OutlineEmail = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="22,4 12,13 2,4"/>
    </svg>
  );
  const OutlineLogout = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16,17 21,12 16,7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );

  // Map icon names to outline SVGs
  const outlineIconMap = {
    'Dashboard': <OutlineDashboard />,
    'Admin Dashboard': <OutlineDashboard />,
    'Submissions': <OutlineSubmissions />,
    'Manage Submissions': <OutlineSubmissions />,
    'Assigned Submissions': <OutlineSubmissions />,
    'Payments': <OutlinePayments />,
    'Manage Payments': <OutlinePayments />,
    'Profile': <OutlineProfile />,
    'Manage Users': <OutlinePeople />,
    'Scores': <OutlineScores />,
    'Certificates': (() => {
      const CertIcon = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="16" rx="2"/>
          <path d="M8 7h8M8 11h5"/>
          <circle cx="16" cy="18" r="4"/>
          <path d="M14 21l2-1 2 1v-3"/>
        </svg>
      );
      return <CertIcon />;
    })(),
    'Settings': <OutlineSettings />,
    'Email Settings': <OutlineEmail />,
  };

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0a3d33 0%, #063b2e 30%, #042f24 60%, #021f18 100%)',
      position: 'relative',
      overflow: 'hidden',
    }} role="navigation" aria-label="Main navigation">

      {/* ─── Dot pattern overlay ─── */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: 0.25,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      {/* ─── Subtle glow at top ─── */}
      <Box sx={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 200,
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ─── Brand Header ─── */}
      <Box sx={{
        px: isCollapsed ? 1 : 2.5,
        py: isCollapsed ? 2 : 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: 1.5,
        position: 'relative', zIndex: 1,
      }}>
        <Box
          component="img" src="/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png" alt="IAGI-GEOSEA"
          sx={{
            width: isCollapsed ? 38 : 44, height: isCollapsed ? 38 : 44,
            borderRadius: '50%', flexShrink: 0, objectFit: 'contain',
            filter: 'drop-shadow(0 2px 8px rgba(16,185,129,0.3))',
            border: '2px solid rgba(255,255,255,0.15)',
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        />
        {!isCollapsed && (
          <Box>
            <Typography sx={{
              fontWeight: 800, fontSize: '1.05rem', color: '#ffffff',
              letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>
              IAGI-GEOSEA
            </Typography>
            <Typography sx={{
              fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)',
              fontWeight: 500, letterSpacing: '0.02em',
            }}>
              Conference 2026
            </Typography>
          </Box>
        )}
      </Box>

      {/* ─── Menu Items ─── */}
      <List sx={{ px: isCollapsed ? 0.75 : 1.5, py: 0.5, flex: 1, position: 'relative', zIndex: 1 }} aria-label="Navigation menu">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const outlineIcon = outlineIconMap[item.text] || item.icon;
          const button = (
            <ListItemButton
              component={Link}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              sx={{
                borderRadius: '14px',
                py: 1.3,
                px: isCollapsed ? 1 : 2,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                backgroundColor: active
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
                backdropFilter: active ? 'blur(12px)' : 'none',
                border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: active
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.05)',
                  transform: !isCollapsed ? 'translateX(4px)' : 'scale(1.05)',
                },
              }}
            >
              <ListItemIcon sx={{
                color: active ? '#10b981' : 'rgba(255,255,255,0.5)',
                minWidth: isCollapsed ? 'auto' : 40,
                justifyContent: 'center',
                transition: 'color 0.25s ease',
                '& .MuiSvgIcon-root': { fontSize: 21 },
              }}>
                {outlineIcon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.88rem',
                    fontWeight: active ? 600 : 450,
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                    letterSpacing: '-0.01em',
                    transition: 'all 0.25s ease',
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.4 }}>
              {isCollapsed ? (
                <Tooltip title={item.text} placement="right" arrow>{button}</Tooltip>
              ) : button}
            </ListItem>
          );
        })}
      </List>

      {/* ─── Logout (frosted glass container) ─── */}
      <Box sx={{ px: isCollapsed ? 0.75 : 1.5, pb: 1, position: 'relative', zIndex: 1 }}>
        {isCollapsed ? (
          <Tooltip title="Logout" placement="right" arrow>
            <ListItemButton
              component={Link} href={route('logout')} method="post"
              sx={{
                borderRadius: '14px', py: 1.2, px: 1,
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box sx={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center' }}>
                <OutlineLogout />
              </Box>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            component={Link} href={route('logout')} method="post"
            sx={{
              borderRadius: '14px', py: 1.2, px: 2,
              bgcolor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.15)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 40 }}>
              <OutlineLogout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}
            />
          </ListItemButton>
        )}
      </Box>

      {/* ─── Copyright Footer ─── */}
      {!isCollapsed && (
        <Box sx={{ px: 2, pb: 2.5, pt: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography sx={{
            color: 'rgba(255,255,255,0.25)',
            fontSize: '0.62rem', fontWeight: 500,
          }}>
            Copyright © 2022 IAGREA, Inc.
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
          width: { md: `calc(100% - ${currentDrawerWidth + 24}px)` },
          ml: { md: `${currentDrawerWidth + 24}px` },
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
            sx={{ mr: 2, display: { md: 'none' } }}
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
              display: { xs: 'none', md: 'flex' },
              width: 34, height: 34,
              borderRadius: '10px',
              border: `1.5px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              bgcolor: isDark ? '#1f2937' : '#fafbfc',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: isDark ? '#374151' : '#f3f4f6',
                borderColor: isDark ? '#4b5563' : '#d1d5db',
                transform: 'scale(1.05)',
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
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              sx={{
                mr: 1.5,
                width: 36, height: 36,
                borderRadius: '10px',
                border: `1.5px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                bgcolor: isDark ? '#1f2937' : '#fafbfc',
                color: isDark ? '#fbbf24' : '#6b7280',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: isDark ? '#374151' : '#f3f4f6',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  transform: 'rotate(20deg) scale(1.05)',
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
            aria-label={`Profile: ${auth.user?.name}`}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              textDecoration: 'none', cursor: 'pointer',
              borderRadius: '14px', px: 1.5, py: 0.8,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary, lineHeight: 1.2 }}>
                {auth.user?.name}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, lineHeight: 1.2 }}>
                {auth.user?.email}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                fontWeight: 700, fontSize: '0.85rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(5, 150, 105, 0.25)',
                border: '2px solid rgba(255,255,255,0.15)',
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
          width: { md: currentDrawerWidth + 24 },
          flexShrink: { md: 0 },
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
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
              borderRadius: '0 24px 24px 0',
              overflow: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              borderRight: 'none',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              overflow: 'hidden',
              background: 'transparent',
              m: 1.5,
              height: 'calc(100vh - 24px)',
              borderRadius: '20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
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
          width: { md: `calc(100% - ${currentDrawerWidth + 24}px)` },
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
