import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueRequestDto, VenueDto } from '../../../types';
import { useSnackbar } from '../../../contexts/SnackbarContext';

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  return useMutation<VenueDto, Error, { id: number; data: VenueRequestDto }>({
    mutationFn: ({ id, data }) => venuesApi.updateVenue(id, data),
    onSuccess: (data) => {
      showSuccess('Заведение успешно обновлено');
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venues', data.id] });
    },
    onError: (error) => {
      showError(error?.message || 'Ошибка при обновлении заведения');
    },
  });
};

