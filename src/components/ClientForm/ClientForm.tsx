import { Box, TextField, Typography } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

interface ClientFormProps {
  name: string;
  phone: string;
  notes: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onNotesChange: (notes: string) => void;
}

export const ClientForm = ({ name, phone, notes, onNameChange, onPhoneChange, onNotesChange }: ClientFormProps) => {
  return (
    <Box className="mb-6">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <PersonIcon sx={{ color: '#3B82F6', fontSize: '20px' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>
          Ваши данные
        </Typography>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box>
          <TextField
            fullWidth
            label="Ваше имя"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Телефон"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
          />
        </Box>
        <Box className="md:col-span-2">
          <TextField
            fullWidth
            label="Примечания (необязательно)"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            multiline
            rows={3}
          />
        </Box>
      </Box>
    </Box>
  );
};

