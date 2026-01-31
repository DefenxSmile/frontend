import { useState, useEffect } from 'react';
import { useVenues } from '../../domain/hooks/venues/useVenues';
import { useDeleteVenue } from '../../domain/hooks/venues/useDeleteVenue';
import { useVenueForm } from '../../hooks/useVenueForm';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { AdminPageLoading } from './AdminPageLoading';
import { AdminPageError } from './AdminPageError';
import { AdminPagePresenter } from './AdminPagePresenter';

export const AdminPageContainer = () => {
  const [mounted, setMounted] = useState(false);
  const { data: venues, isLoading, error, refetch } = useVenues();
  const deleteVenue = useDeleteVenue();
  const venueForm = useVenueForm();
  const confirmDialog = useConfirmDialog();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Удаление заведения',
      message: 'Вы уверены, что хотите удалить это заведение? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        await deleteVenue.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting venue:', err);
      }
    }
  };

  if (isLoading) {
    return <AdminPageLoading />;
  }

  if (error) {
    return (
      <AdminPageError
        message={error instanceof Error ? error.message : 'Не удалось загрузить данные. Проверьте подключение к серверу.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <AdminPagePresenter
      mounted={mounted}
      venues={venues ?? []}
      venueForm={venueForm}
      confirmDialog={confirmDialog}
      isDeleting={deleteVenue.isPending}
      onAddVenue={() => venueForm.openForm()}
      onEditVenue={(venue) => venueForm.openForm(venue)}
      onDeleteVenue={handleDelete}
    />
  );
};
