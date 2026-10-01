import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Add, DeleteOutline, EditOutlined, Refresh } from '@mui/icons-material';
import api from '../api/client';
import { getApiErrorMessage } from '../api/errors';
import DataTable from '../components/DataTable';

const emptyForm = { sectorName: '' };

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecordId, setLoadingRecordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteSector, setDeleteSector] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSectors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/sectors');
      setSectors(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load sectors.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSectors();
  }, [loadSectors]);

  const openCreateForm = () => {
    setEditingSector(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = async (sector) => {
    setLoadingRecordId(sector.id);
    setError('');
    try {
      const response = await api.get(`/sectors/${sector.id}`);
      setEditingSector(response.data);
      setForm({ sectorName: response.data.sectorName || '' });
      setFormOpen(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load sector details.'));
    } finally {
      setLoadingRecordId(null);
    }
  };

  const saveSector = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingSector) {
        await api.put(`/sectors/${editingSector.id}`, form);
        setSuccess('Sector updated.');
      } else {
        await api.post('/sectors', form);
        setSuccess('Sector created.');
      }
      setFormOpen(false);
      await loadSectors();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save sector.'));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteSector) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/sectors/${deleteSector.id}`);
      setSuccess(`Deleted ${deleteSector.sectorName}.`);
      setDeleteSector(null);
      await loadSectors();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete sector.'));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'sectorName', label: 'Sector name' },
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
          <Tooltip title="Edit sector">
            <IconButton aria-label={`Edit ${row.sectorName}`} onClick={() => openEditForm(row)} disabled={loadingRecordId === row.id} size="small" sx={{ color: '#93c5fd' }}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete sector">
            <IconButton aria-label={`Delete ${row.sectorName}`} onClick={() => setDeleteSector(row)} size="small" sx={{ color: '#fca5a5' }}>
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>Sectors</Typography>
          <Typography sx={{ color: '#94a3b8', mt: 0.5 }}>Create, update, and remove stock sectors.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadSectors} disabled={loading}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={openCreateForm}>Add sector</Button>
        </Stack>
      </Stack>

      {error ? <Alert severity="error" sx={{ my: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ my: 2 }}>{success}</Alert> : null}

      <DataTable title="Sector list" rows={sectors} columns={columns} loading={loading} pageSize={10} />

      <Dialog open={formOpen} onClose={() => !saving && setFormOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={saveSector}>
          <DialogTitle>{editingSector ? 'Edit sector' : 'Add sector'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              fullWidth
              label="Sector name"
              margin="normal"
              inputProps={{ maxLength: 100 }}
              value={form.sectorName}
              onChange={(event) => setForm({ sectorName: event.target.value })}
              helperText="Required; maximum 100 characters."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving || !form.sectorName.trim()}>
              {saving ? 'Saving…' : editingSector ? 'Save changes' : 'Create sector'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deleteSector)} onClose={() => !saving && setDeleteSector(null)}>
        <DialogTitle>Delete sector?</DialogTitle>
        <DialogContent>
          <Typography>
            Delete {deleteSector?.sectorName}? The service may reject deletion while stocks are still assigned to it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSector(null)} disabled={saving}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>
            {saving ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
