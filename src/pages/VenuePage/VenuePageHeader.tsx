import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import type { VenueDto } from '../../types';

interface VenuePageHeaderProps {
  venues: VenueDto[] | undefined;
  selectedVenueId: number | null;
  onVenueChange: (venueId: number) => void;
}

export const VenuePageHeader = ({ venues, selectedVenueId, onVenueChange }: VenuePageHeaderProps) => (
  <Box className="venue-page-header">
    <Typography variant="h4" className="venue-page-title">
      Управление заведением
    </Typography>
    <FormControl className="venue-page-select-wrap">
      <Select
        value={selectedVenueId || ''}
        onChange={(e) => onVenueChange(e.target.value as number)}
        className="venue-page-select"
      >
        {venues?.map((venue) => (
          <MenuItem key={venue.id} value={venue.id}>
            {venue.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);
