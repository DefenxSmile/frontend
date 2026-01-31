import { useState, useEffect } from 'react';
import { useVenues } from '../../domain/hooks/venues/useVenues';
import { useReservationObjects } from '../../domain/hooks/reservationObjects/useReservationObjects';
import { useReservations } from '../../domain/hooks/bookings/useBookings';
import { useDeleteReservationObject } from '../../domain/hooks/reservationObjects/useDeleteReservationObject';
import { useReservationObjectForm } from '../../hooks/useReservationObjectForm';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { VenuePagePresenter } from './VenuePagePresenter';

export const VenuePageContainer = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);

  const { data: venues } = useVenues();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (venues && venues.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId]);

  const { data: reservationObjects, isLoading: objectsLoading } = useReservationObjects(
    selectedVenueId ? { venueId: selectedVenueId } : undefined,
    { enabled: !!selectedVenueId }
  );
  const { data: reservations, isLoading: reservationsLoading } = useReservations(
    selectedVenueId ? { reservationObjectId: undefined } : undefined,
    { enabled: !!selectedVenueId }
  );

  const deleteObject = useDeleteReservationObject();
  const objectForm = useReservationObjectForm(selectedVenueId);
  const confirmDialog = useConfirmDialog();

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Удаление объекта бронирования',
      message: 'Вы уверены, что хотите удалить этот объект бронирования? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        await deleteObject.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting reservation object:', err);
      }
    }
  };

  return (
    <VenuePagePresenter
      mounted={mounted}
      selectedVenueId={selectedVenueId}
      selectedTab={selectedTab}
      venues={venues}
      reservationObjects={reservationObjects ?? []}
      reservations={reservations ?? []}
      objectsLoading={objectsLoading}
      reservationsLoading={reservationsLoading}
      objectForm={objectForm}
      confirmDialog={confirmDialog}
      onVenueChange={setSelectedVenueId}
      onTabChange={(_, value) => setSelectedTab(value)}
      onAddObject={() => objectForm.openForm()}
      onEditObject={(obj) => objectForm.openForm(obj)}
      onDeleteObject={handleDelete}
    />
  );
};
