import { Card, Typography, Button } from '@mui/material';
import { TableRestaurant as TableIcon, Add as AddIcon } from '@mui/icons-material';

interface VenuePageEmptyStateProps {
  onAddObject: () => void;
}

export const VenuePageEmptyState = ({ onAddObject }: VenuePageEmptyStateProps) => (
  <Card className="venue-page-empty-card">
    <TableIcon style={{ fontSize: 64, color: '#d1d5db', marginBottom: 16 }} />
    <Typography variant="h6" style={{ color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>
      Нет объектов бронирования
    </Typography>
    <Typography variant="body2" style={{ color: '#9ca3af', marginBottom: 24 }}>
      Создайте первый объект бронирования для вашего заведения
    </Typography>
    <Button variant="contained" startIcon={<AddIcon />} onClick={onAddObject} className="venue-page-btn-primary">
      Добавить объект
    </Button>
  </Card>
);
