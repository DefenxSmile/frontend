import { Box, Card, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { LocationOn as LocationOnIcon } from '@mui/icons-material';
import type { VenueDto } from '../../types';

interface UserPageVenueSelectorProps {
  venues: VenueDto[] | undefined;
  selectedVenue: VenueDto | null;
  selectedVenueId: number | null;
  onVenueChange: (venueId: number) => void;
}

export const UserPageVenueSelector = ({
  venues,
  selectedVenue,
  selectedVenueId,
  onVenueChange,
}: UserPageVenueSelectorProps) => (
  <Card className="user-page-venue-card">
    <Box className="user-page-venue-row">
      {selectedVenue ? (
        <Box className="user-page-venue-info">
          <Typography variant="h5" className="user-page-typography-title">
            {selectedVenue.name}
          </Typography>
          {selectedVenue.address && (
            <Box className="user-page-venue-address">
              <LocationOnIcon className="user-page-icon-primary" />
              <Typography variant="body2" className="user-page-typography-address">
                {selectedVenue.address}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box className="user-page-venue-placeholder">
          <Typography variant="body1" className="user-page-typography-placeholder">
            Выберите заведение
          </Typography>
        </Box>
      )}
      <FormControl className="user-page-form-control-wrap">
        <Select
          value={selectedVenueId || ''}
          onChange={(e) => onVenueChange(e.target.value as number)}
          className="user-page-outlined-input"
        >
          {venues?.map((venue) => (
            <MenuItem key={venue.id} value={venue.id}>
              {venue.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </Card>
);
