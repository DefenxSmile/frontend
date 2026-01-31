import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { Restaurant as RestaurantIcon, Person as PersonIcon } from '@mui/icons-material';
import type { FilteredReservationObject } from './types';

interface UserPageTableCardProps {
  object: FilteredReservationObject;
  onClick: () => void;
}

export const UserPageTableCard = ({ object, onClick }: UserPageTableCardProps) => (
  <Card
    onClick={() => !object.isOccupied && onClick()}
    className={`user-page-table-card ${object.isOccupied ? 'user-page-table-card--occupied' : ''}`}
  >
    {object.isOccupied && (
      <Box className="user-page-card-chip-occupied">
        <Chip label="Занят" size="small" className="user-page-chip-occupied" />
      </Box>
    )}
    {object.images?.[0]?.url ? (
      <Box component="img" src={object.images[0].url} alt={object.name} className="user-page-card-image" />
    ) : (
      <Box className="user-page-card-image-placeholder">
        <RestaurantIcon style={{ fontSize: 64, color: '#d1d5db' }} />
      </Box>
    )}
    <CardContent className="user-page-table-card-content">
      <Typography
        variant="h6"
        className="user-page-typography-card-title"
        style={object.isOccupied ? { color: '#9ca3af' } : undefined}
      >
        {object.name}
      </Typography>
      {object.description && (
        <Typography
          variant="body2"
          className="user-page-typography-card-desc"
          style={object.isOccupied ? { color: '#d1d5db' } : undefined}
        >
          {object.description}
        </Typography>
      )}
      {object.capacity && (
        <Chip
          icon={<PersonIcon style={{ fontSize: 16 }} />}
          label={`До ${object.capacity} чел.`}
          size="small"
          className={object.isOccupied ? 'user-page-chip-capacity user-page-chip-capacity--occupied' : 'user-page-chip-capacity'}
        />
      )}
    </CardContent>
  </Card>
);
