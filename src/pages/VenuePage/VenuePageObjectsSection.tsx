import { Box, Button, Typography, CircularProgress, Grow } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { VenuePageObjectCard } from './VenuePageObjectCard';
import { VenuePageEmptyState } from './VenuePageEmptyState';
import type { ReservationObjectDto } from '../../types';

interface VenuePageObjectsSectionProps {
  mounted: boolean;
  objects: ReservationObjectDto[];
  isLoading: boolean;
  onAddObject: () => void;
  onEditObject: (obj: ReservationObjectDto) => void;
  onDeleteObject: (id: number) => void;
}

export const VenuePageObjectsSection = ({
  mounted,
  objects,
  isLoading,
  onAddObject,
  onEditObject,
  onDeleteObject,
}: VenuePageObjectsSectionProps) => (
  <Box>
    <Box className="venue-page-section-header">
      <Typography variant="h6" className="venue-page-section-title">
        Объекты бронирования (столы, диваны)
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddObject} className="venue-page-btn-primary">
        Добавить объект
      </Button>
    </Box>

    {isLoading ? (
      <Box className="venue-page-loading">
        <CircularProgress />
      </Box>
    ) : objects.length > 0 ? (
      <Box className="venue-page-grid">
        {objects.map((obj, index) => (
          <Grow in={mounted} timeout={600} style={{ transitionDelay: `${index * 100}ms` }} key={obj.id}>
            <Box sx={{ display: 'block', height: '100%' }}>
              <VenuePageObjectCard
              object={obj}
              onEdit={() => onEditObject(obj)}
              onDelete={() => onDeleteObject(obj.id)}
            />
            </Box>
          </Grow>
        ))}
      </Box>
    ) : (
      <VenuePageEmptyState onAddObject={onAddObject} />
    )}
  </Box>
);
