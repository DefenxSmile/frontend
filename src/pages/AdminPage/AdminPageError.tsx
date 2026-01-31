import { Box, Button, Typography, Alert, Container } from '@mui/material';

interface AdminPageErrorProps {
  message: string;
  onRetry: () => void;
}

export const AdminPageError = ({ message, onRetry }: AdminPageErrorProps) => (
  <Box className="admin-page admin-page-error-wrap">
    <Container maxWidth="lg">
      <Alert
        severity="error"
        className="admin-page-alert"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Повторить
          </Button>
        }
      >
        <Typography variant="body1" style={{ fontWeight: 600, marginBottom: 8 }}>
          Ошибка загрузки заведений
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Container>
  </Box>
);
