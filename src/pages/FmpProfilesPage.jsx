import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import api from '../api/client';
import DataTable from '../components/DataTable';

export default function FmpProfilesPage() {
  const [symbolsInput, setSymbolsInput] = useState('AAPL, MSFT, NVDA');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    const symbols = symbolsInput
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (!symbols.length) {
      setError('Enter one or more stock symbols.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.post('/fmp/profiles', { symbols });
      setProfiles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data || 'Unable to fetch FMP profiles.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'companyName', label: 'Company' },
    { key: 'sector', label: 'Sector' },
    { key: 'exchange', label: 'Exchange' },
    { key: 'price', label: 'Price', render: (row) => row.price ?? '—' },
    { key: 'marketCap', label: 'Market Cap', render: (row) => row.marketCap ?? '—' },
    { key: 'website', label: 'Website', render: (row) => row.website ? <a href={row.website} target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>{row.website}</a> : '—' }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 3 }}>FMP Profiles</Typography>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Card sx={{ background: '#0f172a', borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>Fetch profiles</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Symbols (comma separated)"
                value={symbolsInput}
                onChange={(event) => setSymbolsInput(event.target.value)}
                sx={{ '& .MuiInputBase-root': { color: '#f8fafc' }, '& .MuiInputLabel-root': { color: '#cbd5e1' } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" onClick={handleFetch} fullWidth disabled={loading}>
                {loading ? 'Loading...' : 'Fetch profiles'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DataTable title="FMP profile results" rows={profiles} columns={columns} pageSize={6} />
    </Box>
  );
}
