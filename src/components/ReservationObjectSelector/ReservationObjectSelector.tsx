import { Box, Card, CardContent, Typography } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import type { ReservationObjectDto } from '../../types';

interface ReservationObjectSelectorProps {
  objects: ReservationObjectDto[];
  selectedId: number | null;
  minCapacity?: number;
  onSelect: (id: number) => void;
}

export const ReservationObjectSelector = ({
  objects,
  selectedId,
  minCapacity,
  onSelect,
}: ReservationObjectSelectorProps) => {
  const filteredObjects = minCapacity
    ? objects.filter((obj) => !obj.capacity || obj.capacity >= minCapacity)
    : objects;

  return (
    <Box className="mb-6">
      <Typography variant="h6" className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
        Выберите стол
      </Typography>
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredObjects.map((obj) => (
          <Card
            key={obj.id}
            sx={{
              backgroundColor: 'white',
              border: `1px solid ${selectedId === obj.id ? '#3B82F6' : '#E5E7EB'}`,
              borderRadius: '8px',
              boxShadow: selectedId === obj.id ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderColor: selectedId === obj.id ? '#3B82F6' : '#D1D5DB',
              },
            }}
            onClick={() => onSelect(obj.id)}
          >
            <Box
              sx={{
                backgroundColor: '#F9FAFB',
                padding: '16px',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>
                {obj.name}
              </Typography>
            </Box>
            <CardContent className="p-4">
              {obj.description && (
                <Typography variant="body2" className="text-gray-600 dark:text-gray-300 mb-2">
                  {obj.description}
                </Typography>
              )}
              {obj.capacity && (
                <Box className="flex items-center gap-2">
                  <PersonIcon className="text-gray-500 text-sm" />
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                    До {obj.capacity} чел.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

