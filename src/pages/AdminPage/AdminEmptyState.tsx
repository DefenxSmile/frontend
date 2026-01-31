import { Card, Typography, Button } from '@mui/material';
import { Business as BusinessIcon, Add as AddIcon } from '@mui/icons-material';

interface AdminEmptyStateProps {
  onAddVenue: () => void;
}

export const AdminEmptyState = ({ onAddVenue }: AdminEmptyStateProps) => (
  <Card className="admin-page-empty-card">
    <BusinessIcon style={{ fontSize: 64, color: '#d1d5db', marginBottom: 16 }} />
    <Typography variant="h6" style={{ color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>
      Нет заведений
    </Typography>
    <Typography variant="body2" style={{ color: '#9ca3af', marginBottom: 24 }}>
      Создайте первое заведение, чтобы начать работу
    </Typography>
    <Button variant="contained" startIcon={<AddIcon />} onClick={onAddVenue} className="admin-page-btn-primary">
      Добавить заведение
    </Button>
  </Card>
);
