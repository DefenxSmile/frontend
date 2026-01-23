import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import {
  TableRestaurant as TableIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { ReservationObjectDto } from '../../types';
import './ReservationObjectCard.scss';

interface ReservationObjectCardProps {
  object: ReservationObjectDto;
  onEdit: (object: ReservationObjectDto) => void;
  onDelete: (id: number) => void;
}

export const ReservationObjectCard = ({ object, onEdit, onDelete }: ReservationObjectCardProps) => {
  return (
    <Card
      sx={{
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '1px solid #E5E7EB',
        borderRadius: '0',
        boxShadow: 'none',
        padding: '20px 24px',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <CardContent sx={{ padding: '0 !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <TableIcon sx={{ color: '#6B7280', fontSize: '20px' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>
            {object.name}
          </Typography>
        </Box>
        {object.description && (
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', marginBottom: '12px', fontSize: '0.875rem', lineHeight: '1.5' }}
          >
            {object.description}
          </Typography>
        )}
        {object.capacity && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <PersonIcon sx={{ color: '#9CA3AF', fontSize: '16px' }} />
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Вместимость: {object.capacity} чел.
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <IconButton
            size="small"
            onClick={() => onEdit(object)}
            sx={{
              padding: '6px',
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6',
                color: '#374151',
              },
            }}
          >
            <EditIcon sx={{ fontSize: '18px' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(object.id)}
            sx={{
              padding: '6px',
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

