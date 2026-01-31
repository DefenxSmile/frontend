import { Card, Typography } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';

export const UserPageEmptyTables = () => (
  <Card className="user-page-empty-card">
    <RestaurantIcon style={{ fontSize: 64, color: '#d1d5db', marginBottom: 16 }} />
    <Typography variant="h6" style={{ color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>
      Нет доступных столов
    </Typography>
  </Card>
);
