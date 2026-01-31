import { useState, useEffect, useMemo } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale/ru';
import { useVenues } from '../../domain/hooks/venues/useVenues';
import { useVenue } from '../../domain/hooks/venues/useVenue';
import { useReservationObjects } from '../../domain/hooks/reservationObjects/useReservationObjects';
import { useReservations } from '../../domain/hooks/bookings/useBookings';
import { useCreateReservation } from '../../domain/hooks/bookings/useCreateBooking';
import { useCancelReservation } from '../../domain/hooks/bookings/useDeleteBooking';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { UserPagePresenter } from './UserPagePresenter';
import type { FilteredReservationObject } from './types';

export const UserPageContainer = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(new Date());
  const [filterTimeSlot, setFilterTimeSlot] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const { data: venues } = useVenues();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (venues && venues.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId]);

  const { data: selectedVenue } = useVenue(selectedVenueId || 0, { enabled: !!selectedVenueId });
  const { data: reservationObjects } = useReservationObjects(
    selectedVenueId ? { venueId: selectedVenueId } : undefined,
    { enabled: !!selectedVenueId }
  );
  const { data: allReservations } = useReservations(
    selectedVenueId ? { reservationObjectId: undefined } : undefined,
    { enabled: !!selectedVenueId }
  );
  const { data: myReservations } = useReservations(undefined, { enabled: true });
  const createReservation = useCreateReservation();
  const cancelReservation = useCancelReservation();
  const timeSlots = useTimeSlots();
  const confirmDialog = useConfirmDialog();

  const filteredObjects = useMemo((): FilteredReservationObject[] => {
    if (!reservationObjects) return [];

    if (!filterDate || !filterTimeSlot) {
      return reservationObjects.map((obj) => ({ ...obj, isOccupied: false }));
    }

    const [hours, minutes] = filterTimeSlot.split(':').map(Number);
    const filterStart = new Date(filterDate);
    filterStart.setHours(hours, minutes, 0, 0);
    const filterEnd = new Date(filterStart);
    filterEnd.setHours(hours + 2, minutes, 0, 0);

    return reservationObjects.map((obj) => {
      const isOccupied = allReservations?.some((reservation) => {
        if (reservation.reservationObjectId !== obj.id || reservation.status === 'CANCELLED') return false;
        const resStart = new Date(reservation.startDateTime);
        const resEnd = new Date(reservation.endDateTime);
        return resStart < filterEnd && resEnd > filterStart;
      });
      return { ...obj, isOccupied: !!isOccupied };
    });
  }, [reservationObjects, allReservations, filterDate, filterTimeSlot]);

  const handleTableClick = (objectId: number) => {
    setSelectedObjectId(objectId);
    setSelectedDate(filterDate || new Date());
    setSelectedTime(filterTimeSlot || '');
    setDrawerOpen(true);
  };

  const handleBookTable = async () => {
    if (!selectedVenueId || !selectedDate || !selectedTime || !selectedObjectId || !clientName || !clientPhone) return;

    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(hours + 2, minutes, 0, 0);

    try {
      await createReservation.mutateAsync({
        reservationObjectId: selectedObjectId,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        notes: notes || undefined,
      });
      setDrawerOpen(false);
      setSelectedTime('');
      setSelectedObjectId(null);
      setNotes('');
      setClientName('');
      setClientPhone('');
      setActiveTab(1);
    } catch (err) {
      console.error('Error creating reservation:', err);
    }
  };

  const handleCancelReservation = async (id: number) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Отмена бронирования',
      message: 'Вы уверены, что хотите отменить это бронирование?',
      confirmText: 'Отменить',
      cancelText: 'Нет',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        await cancelReservation.mutateAsync(id);
      } catch (err) {
        console.error('Error canceling reservation:', err);
      }
    }
  };

  const selectedObject = reservationObjects?.find((obj) => obj.id === selectedObjectId);

  const bookingFormState = {
    selectedObject: selectedObject ?? null,
    selectedDate,
    selectedTime,
    guests,
    clientName,
    clientPhone,
    notes,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <UserPagePresenter
        mounted={mounted}
        selectedVenueId={selectedVenueId}
        selectedVenue={selectedVenue ?? null}
        venues={venues}
        activeTab={activeTab}
        filterDate={filterDate}
        filterTimeSlot={filterTimeSlot}
        timeSlots={timeSlots}
        filteredObjects={filteredObjects}
        reservationObjectsCount={reservationObjects?.length ?? 0}
        myReservations={myReservations ?? []}
        drawerOpen={drawerOpen}
        bookingFormState={bookingFormState}
        createReservationPending={createReservation.isPending}
        confirmDialog={confirmDialog}
        onVenueChange={setSelectedVenueId}
        onTabChange={(_, value) => setActiveTab(value)}
        onFilterDateChange={setFilterDate}
        onFilterTimeSlotChange={setFilterTimeSlot}
        onTableClick={handleTableClick}
        onCancelReservation={handleCancelReservation}
        onDrawerClose={() => setDrawerOpen(false)}
        onBook={handleBookTable}
        onBookingDateChange={setSelectedDate}
        onBookingTimeChange={setSelectedTime}
        onBookingGuestsChange={setGuests}
        onBookingClientNameChange={setClientName}
        onBookingClientPhoneChange={setClientPhone}
        onBookingNotesChange={setNotes}
      />
    </LocalizationProvider>
  );
};
