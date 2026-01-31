import { Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import { Restaurant as RestaurantIcon, Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import type { ReservationObjectDto } from '../../types';

interface VenuePageObjectCardProps {
  object: ReservationObjectDto;
  onEdit: () => void;
  onDelete: () => void;
}

export const VenuePageObjectCard = ({ object, onEdit, onDelete }: VenuePageObjectCardProps) => (
  <Card className="venue-page-card">
    {object.images?.[0]?.url ? (
      <Box component="img" src={object.images[0].url} alt={object.name} className="venue-page-card-image" />
    ) : (
      <Box className="venue-page-card-image-placeholder">
        <RestaurantIcon style={{ fontSize: 64, color: '#d1d5db' }} />
      </Box>
    )}
    <CardContent>
      <Box className="venue-page-card-actions">
        <IconButton size="small" onClick={onEdit} className="venue-page-icon-btn-edit">
          <EditIcon style={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" onClick={onDelete} className="venue-page-icon-btn-delete">
          <DeleteIcon style={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <Typography variant="h6" className="venue-page-card-title">
        {object.name}
      </Typography>
      {object.description && (
        <Typography variant="body2" style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 12 }}>
          {object.description}
        </Typography>
      )}
      {object.capacity && (
        <Chip
          icon={<PersonIcon style={{ fontSize: 16 }} />}
          label={`До ${object.capacity} чел.`}
          size="small"
          style={{ backgroundColor: '#f3f4f6', color: '#6b7280', fontWeight: 500 }}
        />
      )}
    </CardContent>
  </Card>
);
