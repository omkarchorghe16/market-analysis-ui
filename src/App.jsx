import { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  BarChart,
  Business,
  Inventory,
  Menu,
  Bolt
} from '@mui/icons-material';
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import DigestPage from './pages/DigestPage';
import SectorsPage from './pages/SectorsPage';
import StocksPage from './pages/StocksPage';
import FmpProfilesPage from './pages/FmpProfilesPage';

const navItems = [
  { label: 'Dashboard', path: '/', icon: <Dashboard /> },
  { label: 'Digest', path: '/digest', icon: <Bolt /> },
  { label: 'Sectors', path: '/sectors', icon: <Business /> },
  { label: 'Stocks', path: '/stocks', icon: <Inventory /> },
  { label: 'FMP Profiles', path: '/fmp-profiles', icon: <BarChart /> }
];

export default function App() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItem = navItems.find((item) => item.path === location.pathname);
  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
          Market Analysis
        </Typography>
      </Toolbar>

      <List sx={{ px: 1.5, py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.75,
              color: location.pathname === item.path ? '#fff' : '#cbd5e1',
              backgroundColor: location.pathname === item.path ? 'rgba(59, 130, 246, 0.22)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(148, 163, 184, 0.12)' }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: 'auto', px: 2, py: 2, borderTop: '1px solid rgba(148,163,184,0.15)' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          Stock News Scheduler Service
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)' }}>
      <CssBaseline />

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={!isMobile || mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: { md: 260 },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            background: '#0b1120',
            color: '#e2e8f0',
            borderRight: '1px solid rgba(148, 163, 184, 0.2)'
          }
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            color: '#e2e8f0',
            borderBottom: '1px solid rgba(148,163,184,0.15)'
          }}
        >
          <Toolbar>
            {isMobile ? (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2, color: 'inherit' }} aria-label="Open navigation menu">
                <Menu />
              </IconButton>
            ) : null}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              {activeItem?.label || 'Market Analysis'}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/digest" element={<DigestPage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/fmp-profiles" element={<FmpProfilesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
