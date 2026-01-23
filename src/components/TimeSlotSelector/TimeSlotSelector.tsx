import { Box, Button, Typography } from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';

interface TimeSlotSelectorProps {
  selectedTime: string;
  availableSlots: string[];
  onSelect: (time: string) => void;
  isAvailable?: (time: string) => boolean;
}

export const TimeSlotSelector = ({
  selectedTime,
  availableSlots,
  onSelect,
  isAvailable = () => true,
}: TimeSlotSelectorProps) => {
  return (
    <Box className="mb-6">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <TimeIcon sx={{ color: '#3B82F6', fontSize: '20px' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>
          Выберите время брони
        </Typography>
      </Box>
      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
        Во сколько вы хотите придти?
      </Typography>
      <Box className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {availableSlots.map((time) => {
          const available = isAvailable(time);
          return (
            <Box key={time}>
              <Button
                fullWidth
                variant={selectedTime === time ? 'contained' : 'outlined'}
                onClick={() => onSelect(time)}
                disabled={!available}
                sx={{
                  backgroundColor: selectedTime === time ? '#3B82F6' : 'white',
                  color: selectedTime === time ? 'white' : available ? '#374151' : '#9CA3AF',
                  border: `1px solid ${selectedTime === time ? '#3B82F6' : available ? '#D1D5DB' : '#E5E7EB'}`,
                  borderRadius: '6px',
                  padding: '12px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: selectedTime === time ? '#2563EB' : available ? '#F9FAFB' : 'white',
                    borderColor: selectedTime === time ? '#2563EB' : available ? '#3B82F6' : '#E5E7EB',
                  },
                  '&:disabled': {
                    backgroundColor: '#F9FAFB',
                    color: '#9CA3AF',
                    cursor: 'not-allowed',
                  },
                }}
              >
                {time}
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

