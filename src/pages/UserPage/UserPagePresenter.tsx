import { Box, Container, Grow, Fade, Alert, Typography } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import { ConfirmDialog } from '../../components';
import { UserPageVenueSelector } from './UserPageVenueSelector';
import { UserPageTabs } from './UserPageTabs';
import { UserPageFilterCard } from './UserPageFilterCard';
import { UserPageTablesGrid } from './UserPageTablesGrid';
import { UserPageEmptyTables } from './UserPageEmptyTables';
import { UserPageBookingsCard } from './UserPageBookingsCard';
import { UserPageBookingDrawer } from './UserPageBookingDrawer';
import type { VenueDto, ReservationDto } from '../../types';
import type { FilteredReservationObject } from './types';
import './UserPage.scss';

export interface UserPagePresenterProps {
  mounted: boolean;
  selectedVenueId: number | null;
  selectedVenue: VenueDto | null;
  venues: VenueDto[] | undefined;
  activeTab: number;
  filterDate: Date | null;
  filterTimeSlot: string;
  timeSlots: string[];
  filteredObjects: FilteredReservationObject[];
  reservationObjectsCount: number;
  myReservations: ReservationDto[];
  drawerOpen: boolean;
  bookingFormState: import('./UserPageBookingDrawer').UserPageBookingDrawerFormState;
  createReservationPending: boolean;
  confirmDialog: {
    open: boolean;
    options: { title: string; message: string; confirmText?: string; cancelText?: string; confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' };
    handleConfirm: () => void;
    handleCancel: () => void;
  };
  onVenueChange: (venueId: number) => void;
  onTabChange: (_: React.SyntheticEvent, value: number) => void;
  onFilterDateChange: (date: Date | null) => void;
  onFilterTimeSlotChange: (time: string) => void;
  onTableClick: (objectId: number) => void;
  onCancelReservation: (id: number) => void;
  onDrawerClose: () => void;
  onBook: () => void;
  onBookingDateChange: (date: Date | null) => void;
  onBookingTimeChange: (time: string) => void;
  onBookingGuestsChange: (guests: number) => void;
  onBookingClientNameChange: (value: string) => void;
  onBookingClientPhoneChange: (value: string) => void;
  onBookingNotesChange: (value: string) => void;
}

export const UserPagePresenter = ({
  mounted,
  selectedVenueId,
  selectedVenue,
  venues,
  activeTab,
  filterDate,
  filterTimeSlot,
  timeSlots,
  filteredObjects,
  reservationObjectsCount,
  myReservations,
  drawerOpen,
  bookingFormState,
  createReservationPending,
  confirmDialog,
  onVenueChange,
  onTabChange,
  onFilterDateChange,
  onFilterTimeSlotChange,
  onTableClick,
  onCancelReservation,
  onDrawerClose,
  onBook,
  onBookingDateChange,
  onBookingTimeChange,
  onBookingGuestsChange,
  onBookingClientNameChange,
  onBookingClientPhoneChange,
  onBookingNotesChange,
}: UserPagePresenterProps) => (
  <Box className="user-page">
    <Container maxWidth="lg">
      <Grow in={mounted} timeout={600}>
        <Box sx={{ display: 'block' }}>
          <UserPageVenueSelector
          venues={venues}
          selectedVenue={selectedVenue ?? null}
          selectedVenueId={selectedVenueId}
          onVenueChange={onVenueChange}
        />
        </Box>
      </Grow>

      {selectedVenueId && (
        <>
          <Grow in={mounted} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Box sx={{ display: 'block' }}>
              <UserPageTabs value={activeTab} onChange={onTabChange} />
            </Box>
          </Grow>

          {activeTab === 0 && (
            <Fade in={activeTab === 0} timeout={300}>
              <Box>
                <UserPageFilterCard
                  filterDate={filterDate}
                  filterTimeSlot={filterTimeSlot}
                  timeSlots={timeSlots}
                  onDateChange={onFilterDateChange}
                  onTimeSlotChange={onFilterTimeSlotChange}
                />

                <Box>
                  <Box className="user-page-tables-header">
                    <RestaurantIcon className="user-page-icon-primary user-page-icon-primary--lg" />
                    <Typography variant="h6" className="user-page-typography-section">
                      Доступные столы
                    </Typography>
                  </Box>
                  {reservationObjectsCount > 0 ? (
                    <UserPageTablesGrid objects={filteredObjects} mounted={mounted} onTableClick={onTableClick} />
                  ) : (
                    <UserPageEmptyTables />
                  )}
                </Box>
              </Box>
            </Fade>
          )}

          {activeTab === 1 && (
            <Fade in={activeTab === 1} timeout={300}>
              <Box>
                <UserPageBookingsCard reservations={myReservations} onCancel={onCancelReservation} />
              </Box>
            </Fade>
          )}
        </>
      )}

      {!selectedVenueId && (
        <Alert severity="info" style={{ borderRadius: 16, padding: 20, fontSize: '0.9375rem' }}>
          Выберите заведение для бронирования стола
        </Alert>
      )}

      <UserPageBookingDrawer
        open={drawerOpen}
        formState={bookingFormState}
        timeSlots={timeSlots}
        isPending={createReservationPending}
        onClose={onDrawerClose}
        onBook={onBook}
        onDateChange={onBookingDateChange}
        onTimeChange={onBookingTimeChange}
        onGuestsChange={onBookingGuestsChange}
        onClientNameChange={onBookingClientNameChange}
        onClientPhoneChange={onBookingClientPhoneChange}
        onNotesChange={onBookingNotesChange}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.options.title}
        message={confirmDialog.options.message}
        confirmText={confirmDialog.options.confirmText}
        cancelText={confirmDialog.options.cancelText}
        confirmColor={confirmDialog.options.confirmColor}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />
    </Container>
  </Box>
);
