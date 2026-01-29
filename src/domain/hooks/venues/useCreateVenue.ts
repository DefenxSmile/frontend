import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueRequestDto, VenueDto } from '../../../types';
import { useSnackbar } from '../../../contexts/SnackbarContext';

export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  return useMutation<VenueDto, Error, VenueRequestDto>({
    mutationFn: (data: VenueRequestDto) => venuesApi.createVenue(data),
    onSuccess: () => {
      showSuccess('Заведение успешно создано');
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
    onError: (error) => {
      showError(error?.message || 'Ошибка при создании заведения');
    },
  });
};

