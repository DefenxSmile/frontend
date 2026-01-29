import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import { useSnackbar } from '../../../contexts/SnackbarContext';

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => venuesApi.deleteVenue(id),
    onSuccess: (_, id) => {
      showSuccess('Заведение успешно удалено');
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.removeQueries({ queryKey: ['venues', id] });
    },
    onError: (error) => {
      showError(error?.message || 'Ошибка при удалении заведения');
    },
  });
};

