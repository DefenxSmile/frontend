import { Box, Typography } from '@mui/material';
import { Slide } from '@mui/material';

interface HomePageHintProps {
  mounted: boolean;
}

export const HomePageHint = ({ mounted }: HomePageHintProps) => (
  <Slide direction="up" in={mounted} timeout={1000} style={{ transitionDelay: '800ms' }}>
    <Box className="home-page-hint">
      <Typography variant="body2" className={`home-page-hint-text ${mounted ? 'home-page-hint-animate' : ''}`}>
        Выберите роль для входа в систему
      </Typography>
    </Box>
  </Slide>
);
