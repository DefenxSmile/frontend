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
    <Card className="venue-card">
      <CardContent className="venue-card-content">
        <Box className="flex items-center gap-2 mb-3">
          <BusinessIcon className="text-gray-500 text-xl" />
          <Typography variant="h6" className="font-semibold text-gray-900 text-base">
            {venue.name}
          </Typography>
        </Box>
        {venue.address && (
          <Box className="flex items-start gap-2 mb-2">
            <LocationOnIcon className="text-gray-400 text-base mt-0.5 shrink-0" />
            <Typography variant="body2" className="text-gray-500 text-sm">
              {venue.address}
            </Typography>
          </Box>
        )}
        {venue.phone && (
          <Box className="flex items-center gap-2 mb-2">
            <PhoneIcon className="text-gray-400 text-base shrink-0" />
            <Typography variant="body2" className="text-gray-500 text-sm">
              {venue.phone}
            </Typography>
          </Box>
        )}
        {venue.description && (
          <Typography variant="body2" className="text-gray-500 text-sm mb-3 leading-relaxed">
            {venue.description}
          </Typography>
        )}
        <Box className="flex gap-2 mt-3">
          <IconButton size="small" onClick={() => onEdit(venue)} className="venue-card-icon-btn-edit">
            <EditIcon className="text-lg" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(venue.id)} className="venue-card-icon-btn-delete">
            <DeleteIcon className="text-lg" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

