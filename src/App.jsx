import { useMemo } from 'react';
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
  Typography
} from '@mui/material';
import {
  Dashboard,
  BarChart,
  Business,
  Inventory,
  Menu,
  Logout,
  Bolt
} from '@mui/icons-material';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
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
  const activePath = useMemo(() => location.pathname, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)' }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            background: '#0b1120',
            color: '#e2e8f0',
            borderRight: '1px solid rgba(148, 163, 184, 0.2)'
          }
        }}
      >
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
              selected={activePath === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.75,
                color: activePath === item.path ? '#fff' : '#cbd5e1',
                backgroundColor: activePath === item.path ? 'rgba(59, 130, 246, 0.22)' : 'transparent',
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
            <IconButton edge="start" sx={{ mr: 2, color: 'inherit' }}>
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              {navItems.find((item) => item.path === activePath)?.label || 'Market Analysis'}
            </Typography>
            <IconButton sx={{ color: 'inherit' }}>
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/digest" element={<DigestPage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/fmp-profiles" element={<FmpProfilesPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
