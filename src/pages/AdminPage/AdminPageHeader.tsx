import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AdminPageHeaderProps {
  onAddVenue: () => void;
}

export const AdminPageHeader = ({ onAddVenue }: AdminPageHeaderProps) => (
  <Box className="admin-page-header">
    <Typography variant="h4" className="admin-page-title">
      Управление заведениями
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onAddVenue}
      className="admin-page-btn-primary"
    >
      Добавить заведение
    </Button>
  </Box>
);
