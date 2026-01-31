import { Card, Typography } from '@mui/material';
import { ReservationsTable } from '../../components';
import type { ReservationDto } from '../../types';

interface UserPageBookingsCardProps {
  reservations: ReservationDto[];
  onCancel: (id: number) => void;
}

export const UserPageBookingsCard = ({ reservations, onCancel }: UserPageBookingsCardProps) => (
  <Card className="user-page-bookings-card">
    <Typography variant="h5" style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1f2937', marginBottom: 24, letterSpacing: '-0.02em' }}>
      Мои бронирования
    </Typography>
    <ReservationsTable reservations={reservations} showActions onCancel={onCancel} />
  </Card>
);
