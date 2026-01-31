import { useState, useCallback } from 'react';
import type { ReservationObjectDto, ReservationObjectRequestDto } from '../types';
import { useCreateReservationObject } from '../domain/hooks/reservationObjects/useCreateReservationObject';
import { useUpdateReservationObject } from '../domain/hooks/reservationObjects/useUpdateReservationObject';

const initialFormData = (venueId: number): ReservationObjectRequestDto => ({
  name: '',
  description: '',
  capacity: undefined,
  venueId,
  image: undefined,
});

export const useReservationObjectForm = (venueId: number | null) => {
  const [open, setOpen] = useState(false);
  const [editingObject, setEditingObject] = useState<ReservationObjectDto | null>(null);
  const [formData, setFormData] = useState<ReservationObjectRequestDto>(
    initialFormData(venueId || 0)
  );

  const createObject = useCreateReservationObject();
  const updateObject = useUpdateReservationObject();

  const openForm = useCallback(
    (object?: ReservationObjectDto) => {
      if (object) {
        setEditingObject(object);
        setFormData({
          name: object.name || '',
          description: object.description || '',
          capacity: object.capacity,
          venueId: object.venueId,
          image: object.images?.[0],
        });
      } else {
        setEditingObject(null);
        setFormData(initialFormData(venueId || 0));
      }
      setOpen(true);
    },
    [venueId]
  );

  const closeForm = useCallback(() => {
    setOpen(false);
    setEditingObject(null);
    setFormData(initialFormData(venueId || 0));
  }, [venueId]);

  const submit = useCallback(async () => {
    if (!formData.venueId) return;
    try {
      if (editingObject) {
        await updateObject.mutateAsync({ id: editingObject.id, data: formData });
      } else {
        await createObject.mutateAsync(formData);
      }
      closeForm();
    } catch (error) {
      console.error('Error saving reservation object:', error);
      throw error;
    }
  }, [editingObject, formData, createObject, updateObject, closeForm]);

  return {
    open,
    editingObject,
    formData,
    isLoading: createObject.isPending || updateObject.isPending,
    openForm,
    closeForm,
    submit,
    setFormData,
  };
};

