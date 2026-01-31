import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import {
  TableRestaurant as TableIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { ReservationObjectDto } from '../../types';
import './ReservationObjectCard.scss';

interface ReservationObjectCardProps {
  object: ReservationObjectDto;
  onEdit: (object: ReservationObjectDto) => void;
  onDelete: (id: number) => void;
}

export const ReservationObjectCard = ({ object, onEdit, onDelete }: ReservationObjectCardProps) => {
  return (
    <Card className="reservation-object-card">
      <CardContent className="reservation-object-card-content">
        <Box className="flex items-center gap-2 mb-3">
          <TableIcon className="text-gray-500 text-xl" />
          <Typography variant="h6" className="font-semibold text-gray-900 text-base">
            {object.name}
          </Typography>
        </Box>
        {object.description && (
          <Typography variant="body2" className="text-gray-500 text-sm mb-3 leading-relaxed">
            {object.description}
          </Typography>
        )}
        {object.capacity && (
          <Box className="flex items-center gap-2 mb-3">
            <PersonIcon className="text-gray-400 text-base shrink-0" />
            <Typography variant="body2" className="text-gray-500 text-sm">
              Вместимость: {object.capacity} чел.
            </Typography>
          </Box>
        )}
        <Box className="flex gap-2 mt-3">
          <IconButton size="small" onClick={() => onEdit(object)} className="reservation-object-card-icon-btn-edit">
            <EditIcon className="text-lg" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(object.id)} className="reservation-object-card-icon-btn-delete">
            <DeleteIcon className="text-lg" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

