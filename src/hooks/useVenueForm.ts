import { useState, useCallback } from 'react';
import type { VenueDto, VenueRequestDto } from '../types';
import { useCreateVenue } from '../domain/hooks/venues/useCreateVenue';
import { useUpdateVenue } from '../domain/hooks/venues/useUpdateVenue';

const initialFormData: VenueRequestDto = {
  name: '',
  address: '',
  description: '',
  phone: '',
  image: undefined,
};

export const useVenueForm = () => {
  const [open, setOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<VenueDto | null>(null);
  const [formData, setFormData] = useState<VenueRequestDto>(initialFormData);

  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();

  const openForm = useCallback((venue?: VenueDto) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name || '',
        address: venue.address || '',
        description: venue.description || '',
        phone: venue.phone || '',
        image: venue.image,
      });
    } else {
      setEditingVenue(null);
      setFormData(initialFormData);
    }
    setOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setOpen(false);
    setEditingVenue(null);
    setFormData(initialFormData);
  }, []);

  const submit = useCallback(async () => {
    try {
      if (editingVenue) {
        await updateVenue.mutateAsync({ id: editingVenue.id, data: formData });
      } else {
        await createVenue.mutateAsync(formData);
      }
      closeForm();
    } catch (error) {
      console.error('Error saving venue:', error);
      throw error;
    }
  }, [editingVenue, formData, createVenue, updateVenue, closeForm]);

  return {
    open,
    editingVenue,
    formData,
    isLoading: createVenue.isPending || updateVenue.isPending,
    openForm,
    closeForm,
    submit,
    setFormData,
    createVenue,
    updateVenue,
  };
};

