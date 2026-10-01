import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Download } from '@mui/icons-material';
import api from '../api/client';
import { getApiErrorMessage } from '../api/errors';
import DataTable from '../components/DataTable';

export default function FmpProfilesPage() {
  const [symbolsInput, setSymbolsInput] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfiles = async (event) => {
    event.preventDefault();
    const symbols = [...new Set(symbolsInput
      .split(/[\s,;]+/)
      .map((symbol) => symbol.trim().toUpperCase())
      .filter(Boolean))];

    if (symbols.length === 0) {
      setError('Enter one or more stock symbols.');
      setSuccess('');
      return;
    }

    const invalidSymbols = symbols.filter((symbol) => !/^[A-Z0-9][A-Z0-9.-]{0,19}$/.test(symbol));
    if (invalidSymbols.length > 0) {
      setError(`Invalid symbol${invalidSymbols.length > 1 ? 's' : ''}: ${invalidSymbols.join(', ')}`);
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/fmp/profiles', { symbols });
      const fetchedProfiles = Array.isArray(response.data) ? response.data : [];
      setProfiles(fetchedProfiles);
      setSuccess(`Fetched and stored ${fetchedProfiles.length} profile${fetchedProfiles.length === 1 ? '' : 's'}.`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to fetch FMP profiles.'));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'companyName', label: 'Company' },
    { key: 'sector', label: 'Sector' },
    { key: 'exchange', label: 'Exchange' },
    { key: 'price', label: 'Price' },
    { key: 'marketCap', label: 'Market cap' },
    {
      key: 'website',
      label: 'Website',
      render: (row) => row.website ? (
        <a href={row.website} target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>{row.website}</a>
      ) : '—'
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (row) => row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '—'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>FMP Profiles</Typography>
      <Typography sx={{ color: '#94a3b8', mb: 3 }}>
        Fetch and store US company profiles. This API does not provide profile listing, editing, or deletion.
      </Typography>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

      <Card sx={{ background: '#0f172a', borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>Request profiles</Typography>
          <Box component="form" onSubmit={fetchProfiles}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }}>
              <TextField
                fullWidth
                required
                label="Symbols"
                placeholder="AAPL, MSFT, NVDA"
                value={symbolsInput}
                onChange={(event) => setSymbolsInput(event.target.value)}
                helperText="Separate stock symbols with commas, spaces, or new lines."
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Download />}
                disabled={loading}
                sx={{ minWidth: 180, minHeight: 56 }}
              >
                Fetch profiles
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <DataTable
        title="Latest FMP response"
        rows={profiles}
        columns={columns}
        loading={loading}
        pageSize={10}
        emptyMessage="Submit symbols to fetch profile data."
      />
    </Box>
  );
}
