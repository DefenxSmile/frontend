import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { VenueDto } from '../../types';
import './VenueCard.scss';

interface VenueCardProps {
  venue: VenueDto;
  onEdit: (venue: VenueDto) => void;
  onDelete: (id: number) => void;
}

export const VenueCard = ({ venue, onEdit, onDelete }: VenueCardProps) => {
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
          <BusinessIcon sx={{ color: '#6B7280', fontSize: '20px' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>
            {venue.name}
          </Typography>
        </Box>
        {venue.address && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <LocationOnIcon sx={{ color: '#9CA3AF', fontSize: '16px', marginTop: '2px' }} />
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
              {venue.address}
            </Typography>
          </Box>
        )}
        {venue.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <PhoneIcon sx={{ color: '#9CA3AF', fontSize: '16px' }} />
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
              {venue.phone}
            </Typography>
          </Box>
        )}
        {venue.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              marginBottom: '12px',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
          >
            {venue.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <IconButton
            size="small"
            onClick={() => onEdit(venue)}
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
            onClick={() => onDelete(venue.id)}
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

