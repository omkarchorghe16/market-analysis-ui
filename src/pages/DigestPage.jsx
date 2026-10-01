import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material';
import { Bolt, CheckCircleOutline, Refresh, Send } from '@mui/icons-material';
import api from '../api/client';
import { getApiErrorMessage } from '../api/errors';

export default function DigestPage() {
  const [health, setHealth] = useState('');
  const [healthLoading, setHealthLoading] = useState(true);
  const [activeAction, setActiveAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadHealth = useCallback(async () => {
    setHealthLoading(true);
    setError('');

    try {
      const response = await api.get('/digest/health');
      setHealth(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to check digest service health.'));
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  const triggerDigest = async (action, path) => {
    setActiveAction(action);
    setError('');
    setSuccess('');

    try {
      const response = await api.post(path);
      setSuccess(typeof response.data === 'string' ? response.data : `${action} completed successfully.`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, `Unable to run the ${action.toLowerCase()}.`));
    } finally {
      setActiveAction('');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>Digest</Typography>
      <Typography sx={{ color: '#94a3b8', mb: 3 }}>
        Check service availability or manually start a digest run.
      </Typography>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <Card sx={{ background: '#0f172a', color: '#f8fafc', borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>Service health</Typography>
                {healthLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Chip
                    icon={<CheckCircleOutline />}
                    label={health || 'No health status returned'}
                    color={health ? 'success' : 'default'}
                    variant="outlined"
                  />
                )}
              </Box>
              <Button variant="outlined" startIcon={<Refresh />} onClick={loadHealth} disabled={healthLoading}>
                Refresh status
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ background: '#0f172a', color: '#f8fafc', borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Manual runs</Typography>
            <Typography sx={{ color: '#94a3b8', mb: 2 }}>
              These actions immediately send the configured digest notifications.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                startIcon={activeAction === 'Daily digest' ? <CircularProgress size={18} color="inherit" /> : <Bolt />}
                onClick={() => triggerDigest('Daily digest', '/digest/run')}
                disabled={Boolean(activeAction)}
              >
                Run daily digest
              </Button>
              <Button
                variant="outlined"
                startIcon={activeAction === 'Portfolio digest' ? <CircularProgress size={18} color="inherit" /> : <Send />}
                onClick={() => triggerDigest('Portfolio digest', '/digest/portfolio')}
                disabled={Boolean(activeAction)}
              >
                Run portfolio digest
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
