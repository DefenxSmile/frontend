import { useMemo } from 'react';

export const useTimeSlots = (startHour = 10, endHour = 23) => {
  return useMemo(() => {
    const slots: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, [startHour, endHour]);
};

