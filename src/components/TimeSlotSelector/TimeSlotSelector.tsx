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
      <Box className="flex items-center gap-2 mb-4">
        <TimeIcon className="text-blue-500 text-xl" />
        <Typography variant="h6" className="font-semibold text-gray-900 text-base">
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
                className={`rounded-md py-3 normal-case font-medium ${
                  selectedTime === time
                    ? '!bg-blue-500 !text-white'
                    : available
                      ? '!bg-white !text-gray-700 hover:!bg-gray-50 hover:!border-blue-500'
                      : '!bg-gray-50 !text-gray-400 !cursor-not-allowed'
                }`}
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

