import { useEffect, useState } from 'react';
import { Alert, Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import api from '../api/client';
import DataTable from '../components/DataTable';

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [form, setForm] = useState({ sectorName: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSectors = async () => {
    try {
      const response = await api.get('/sectors');
      setSectors(response.data || []);
    } catch (err) {
      setError(err?.response?.data || 'Unable to load sectors.');
    }
  };

  useEffect(() => {
    loadSectors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (editingId) {
        await api.put(`/sectors/${editingId}`, form);
      } else {
        await api.post('/sectors', form);
      }
      setForm({ sectorName: '' });
      setEditingId(null);
      await loadSectors();
    } catch (err) {
      setError(err?.response?.data || 'Unable to save sector.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sector) => {
    setEditingId(sector.id);
    setForm({ sectorName: sector.sectorName || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sector?')) return;
    try {
      await api.delete(`/sectors/${id}`);
      await loadSectors();
    } catch (err) {
      setError(err?.response?.data || 'Unable to delete sector.');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'sectorName', label: 'Sector Name' },
    { key: 'createdAt', label: 'Created At', render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : '—' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => handleEdit(row)}>Edit</Button>
          <Button size="small" variant="contained" color="error" onClick={() => handleDelete(row.id)}>Delete</Button>
        </Stack>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 3 }}>Sectors</Typography>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <Box component="form" onSubmit={handleSubmit} sx={{ background: '#0f172a', p: 3, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
            <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>{editingId ? 'Edit Sector' : 'Add Sector'}</Typography>
            <TextField
              fullWidth
              label="Sector name"
              value={form.sectorName}
              onChange={(event) => setForm({ sectorName: event.target.value })}
              sx={{ mb: 2, '& .MuiInputBase-root': { color: '#f8fafc' }, '& .MuiInputLabel-root': { color: '#cbd5e1' } }}
            />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" disabled={loading || !form.sectorName.trim()}>
                {editingId ? 'Update' : 'Add'}
              </Button>
              {editingId ? (
                <Button variant="outlined" onClick={() => { setEditingId(null); setForm({ sectorName: '' }); }}>
                  Cancel
                </Button>
              ) : null}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <DataTable title="Sector list" rows={sectors} columns={columns} pageSize={5} />
        </Grid>
      </Grid>
    </Box>
  );
}
