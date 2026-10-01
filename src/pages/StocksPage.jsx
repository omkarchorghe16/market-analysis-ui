import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Add, DeleteOutline, EditOutlined, Refresh, Upload } from '@mui/icons-material';
import api from '../api/client';
import { getApiErrorMessage } from '../api/errors';
import DataTable from '../components/DataTable';

const emptyForm = { ticker: '', sectorId: '' };

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [filters, setFilters] = useState({ sectorId: '', ticker: '' });
  const [appliedFilters, setAppliedFilters] = useState({ sectorId: '', ticker: '' });
  const [form, setForm] = useState(emptyForm);
  const [editingStock, setEditingStock] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState({ sectorId: '', tickers: '' });
  const [deleteStock, setDeleteStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRecordId, setLoadingRecordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sectorError, setSectorError] = useState('');

  const loadSectors = useCallback(async () => {
    setSectorError('');
    try {
      const response = await api.get('/sectors');
      setSectors(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setSectorError(getApiErrorMessage(requestError, 'Unable to load sectors.'));
    }
  }, []);

  const loadStocks = useCallback(async (nextFilters = appliedFilters) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        sectorId: nextFilters.sectorId || undefined,
        ticker: nextFilters.ticker.trim() || undefined
      };
      const response = await api.get('/stocks', { params });
      setStocks(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load stocks.'));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadSectors();
  }, [loadSectors]);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const applyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const openCreateForm = () => {
    setEditingStock(null);
    setForm({ ...emptyForm, sectorId: sectors[0] ? String(sectors[0].id) : '' });
    setFormOpen(true);
  };

  const openEditForm = async (stock) => {
    setLoadingRecordId(stock.id);
    setError('');
    try {
      const response = await api.get(`/stocks/${stock.id}`);
      setEditingStock(response.data);
      setForm({ ticker: response.data.ticker || '', sectorId: String(response.data.sectorId ?? '') });
      setFormOpen(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load stock details.'));
    } finally {
      setLoadingRecordId(null);
    }
  };

  const saveStock = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const payload = { ticker: form.ticker.trim().toUpperCase(), sectorId: Number(form.sectorId) };

    try {
      if (editingStock) {
        await api.put(`/stocks/${editingStock.id}`, payload);
        setSuccess('Stock updated.');
      } else {
        await api.post('/stocks', payload);
        setSuccess('Stock created.');
      }
      setFormOpen(false);
      await loadStocks();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save stock.'));
    } finally {
      setSaving(false);
    }
  };

  const createBulkStocks = async (event) => {
    event.preventDefault();
    const tickers = bulkForm.tickers
      .split(/[\s,;]+/)
      .map((ticker) => ticker.trim().toUpperCase())
      .filter(Boolean);

    if (tickers.length === 0) {
      setError('Enter at least one stock ticker.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/stocks/bulk', {
        sectorId: Number(bulkForm.sectorId),
        tickers
      });
      const createdCount = Array.isArray(response.data?.created) ? response.data.created.length : 0;
      const skippedCount = Array.isArray(response.data?.skipped) ? response.data.skipped.length : 0;
      setSuccess(`Bulk import finished: ${createdCount} created, ${skippedCount} skipped.`);
      setBulkOpen(false);
      setBulkForm({ sectorId: '', tickers: '' });
      await loadStocks();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create stocks in bulk.'));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteStock) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/stocks/${deleteStock.id}`);
      setSuccess(`Deleted ${deleteStock.ticker}.`);
      setDeleteStock(null);
      await loadStocks();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete stock.'));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'ticker', label: 'Ticker' },
    { key: 'sectorName', label: 'Sector' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit stock">
            <IconButton aria-label={`Edit ${row.ticker}`} onClick={() => openEditForm(row)} disabled={loadingRecordId === row.id} size="small" sx={{ color: '#93c5fd' }}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete stock">
            <IconButton aria-label={`Delete ${row.ticker}`} onClick={() => setDeleteStock(row)} size="small" sx={{ color: '#fca5a5' }}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>Stocks</Typography>
          <Typography sx={{ color: '#94a3b8', mt: 0.5 }}>Manage sector-associated ticker symbols.</Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => loadStocks()} disabled={loading}>Refresh</Button>
          <Button variant="outlined" startIcon={<Upload />} onClick={() => setBulkOpen(true)} disabled={sectors.length === 0}>Bulk add</Button>
          <Button variant="contained" startIcon={<Add />} onClick={openCreateForm} disabled={sectors.length === 0}>Add stock</Button>
        </Stack>
      </Stack>

      {error ? <Alert severity="error" sx={{ my: 2 }}>{error}</Alert> : null}
      {sectorError ? <Alert severity="error" sx={{ my: 2 }}>{sectorError}</Alert> : null}
      {success ? <Alert severity="success" sx={{ my: 2 }}>{success}</Alert> : null}

      <Box component="form" onSubmit={applyFilters} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="stock-filter-sector-label">Sector</InputLabel>
          <Select
            labelId="stock-filter-sector-label"
            label="Sector"
            value={filters.sectorId}
            onChange={(event) => setFilters((current) => ({ ...current, sectorId: event.target.value }))}
          >
            <MenuItem value="">All sectors</MenuItem>
            {sectors.map((sector) => <MenuItem key={sector.id} value={String(sector.id)}>{sector.sectorName}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Ticker"
          value={filters.ticker}
          onChange={(event) => setFilters((current) => ({ ...current, ticker: event.target.value }))}
        />
        <Button type="submit" variant="outlined">Apply filters</Button>
        <Button type="button" onClick={() => {
          const cleared = { sectorId: '', ticker: '' };
          setFilters(cleared);
          setAppliedFilters(cleared);
        }}>Clear</Button>
      </Box>

      <DataTable title="Stock list" rows={stocks} columns={columns} loading={loading} pageSize={10} />

      <Dialog open={formOpen} onClose={() => !saving && setFormOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={saveStock}>
          <DialogTitle>{editingStock ? 'Edit stock' : 'Add stock'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              fullWidth
              label="Ticker"
              margin="normal"
              inputProps={{ maxLength: 20 }}
              value={form.ticker}
              onChange={(event) => setForm((current) => ({ ...current, ticker: event.target.value }))}
              helperText="Required; maximum 20 characters."
            />
            <FormControl fullWidth required margin="normal">
              <InputLabel id="stock-form-sector-label">Sector</InputLabel>
              <Select
                labelId="stock-form-sector-label"
                label="Sector"
                value={form.sectorId}
                onChange={(event) => setForm((current) => ({ ...current, sectorId: event.target.value }))}
              >
                {sectors.map((sector) => <MenuItem key={sector.id} value={String(sector.id)}>{sector.sectorName}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving || !form.ticker.trim() || !form.sectorId}>
              {saving ? 'Saving…' : editingStock ? 'Save changes' : 'Create stock'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={bulkOpen} onClose={() => !saving && setBulkOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={createBulkStocks}>
          <DialogTitle>Bulk add stocks</DialogTitle>
          <DialogContent>
            <FormControl fullWidth required margin="normal">
              <InputLabel id="bulk-stock-sector-label">Sector</InputLabel>
              <Select
                labelId="bulk-stock-sector-label"
                label="Sector"
                value={bulkForm.sectorId}
                onChange={(event) => setBulkForm((current) => ({ ...current, sectorId: event.target.value }))}
              >
                {sectors.map((sector) => <MenuItem key={sector.id} value={String(sector.id)}>{sector.sectorName}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              multiline
              minRows={3}
              label="Tickers"
              margin="normal"
              value={bulkForm.tickers}
              onChange={(event) => setBulkForm((current) => ({ ...current, tickers: event.target.value }))}
              helperText="Separate symbols with commas, spaces, or new lines."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving || !bulkForm.sectorId || !bulkForm.tickers.trim()}>
              {saving ? 'Adding…' : 'Add stocks'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deleteStock)} onClose={() => !saving && setDeleteStock(null)}>
        <DialogTitle>Delete stock?</DialogTitle>
        <DialogContent>
          <Typography>Delete {deleteStock?.ticker} from {deleteStock?.sectorName}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteStock(null)} disabled={saving}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>
            {saving ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
