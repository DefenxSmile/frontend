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
            className={`cursor-pointer transition-all duration-200 rounded-lg ${
              selectedId === obj.id
                ? 'border-2 border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)] hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => onSelect(obj.id)}
          >
            <Box className="bg-gray-50 p-4 border-b border-gray-200">
              <Typography variant="h6" className="font-semibold text-gray-900 text-base">
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

