import { Box, Card, Typography, CircularProgress } from '@mui/material';
import { ReservationsTable } from '../../components';
import type { ReservationDto } from '../../types';

interface VenuePageBookingsSectionProps {
  reservations: ReservationDto[];
  isLoading: boolean;
}

export const VenuePageBookingsSection = ({ reservations, isLoading }: VenuePageBookingsSectionProps) => (
  <Box>
    <Card className="venue-page-bookings-card">
      <Typography variant="h5" style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1f2937', marginBottom: 24, letterSpacing: '-0.02em' }}>
        Бронирования
      </Typography>
      {isLoading ? (
        <Box className="venue-page-loading">
          <CircularProgress />
        </Box>
      ) : (
        <ReservationsTable reservations={reservations} />
      )}
    </Card>
  </Box>
);
