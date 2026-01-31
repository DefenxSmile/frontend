import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Business as BusinessIcon, LocationOn as LocationOnIcon, Phone as PhoneIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { VenueDto } from '../../types';

interface AdminVenueCardProps {
  venue: VenueDto;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const AdminVenueCard = ({ venue, isDeleting, onEdit, onDelete }: AdminVenueCardProps) => (
  <Card className="admin-page-card">
    {venue.image?.url ? (
      <Box component="img" src={venue.image.url} alt={venue.name} className="admin-page-card-image" />
    ) : (
      <Box className="admin-page-card-image-placeholder">
        <BusinessIcon style={{ fontSize: 64, color: 'white', opacity: 0.9 }} />
      </Box>
    )}

    <CardContent>
      <Box className="admin-page-card-actions">
        <IconButton size="small" onClick={onEdit} className="admin-page-icon-btn-edit">
          <EditIcon style={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" onClick={onDelete} disabled={isDeleting} className="admin-page-icon-btn-delete">
          <DeleteIcon style={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Typography variant="h6" className="admin-page-card-title">
        {venue.name}
      </Typography>

      {venue.address && (
        <Box className="admin-page-card-row">
          <LocationOnIcon style={{ color: '#6b7280', fontSize: 18, marginTop: 2, flexShrink: 0 }} />
          <Typography variant="body2" style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>
            {venue.address}
          </Typography>
        </Box>
      )}

      {venue.phone && (
        <Box className="admin-page-card-row admin-page-card-row--center">
          <PhoneIcon style={{ color: '#6b7280', fontSize: 18, flexShrink: 0 }} />
          <Typography variant="body2" style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {venue.phone}
          </Typography>
        </Box>
      )}

      {venue.description && (
        <Typography variant="body2" style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 12 }}>
          {venue.description}
        </Typography>
      )}
    </CardContent>
  </Card>
);
