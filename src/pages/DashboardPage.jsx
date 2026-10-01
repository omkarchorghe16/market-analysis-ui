import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { ArrowForward, BarChart, Business, Inventory } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { getApiErrorMessage } from '../api/errors';

export default function DashboardPage() {
  const [health, setHealth] = useState('');
  const [sectorCount, setSectorCount] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [healthRes, sectorsRes, stocksRes] = await Promise.all([
          api.get('/digest/health'),
          api.get('/sectors'),
          api.get('/stocks')
        ]);

        setHealth(healthRes.data || 'Healthy');
        setSectorCount(Array.isArray(sectorsRes.data) ? sectorsRes.data.length : 0);
        setStockCount(Array.isArray(stocksRes.data) ? stocksRes.data.length : 0);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load dashboard summary.'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>Dashboard</Typography>
          <Typography variant="body1" sx={{ color: '#cbd5e1' }}>Monitor digest health and core stock management metrics.</Typography>
        </Box>
      </Stack>

      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>Digest</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{loading ? '...' : health}</Typography>
                </Box>
                <BarChart />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#0f172a', color: '#f8fafc', borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Sectors</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{sectorCount}</Typography>
                </Box>
                <Business />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#0f172a', color: '#f8fafc', borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Stocks</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stockCount}</Typography>
                </Box>
                <Inventory />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: '#0f172a', borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)', color: '#f8fafc', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick actions</Typography>
              <Stack spacing={1.5}>
                <Button component={Link} to="/digest" variant="contained" endIcon={<ArrowForward />}>Open digest panel</Button>
                <Button component={Link} to="/sectors" variant="outlined">Manage sectors</Button>
                <Button component={Link} to="/stocks" variant="outlined">Manage stocks</Button>
                <Button component={Link} to="/fmp-profiles" variant="outlined">Fetch FMP profiles</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
