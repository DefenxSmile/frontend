import { Box, Typography } from '@mui/material';
import { Slide } from '@mui/material';

interface HomePageHeroProps {
  mounted: boolean;
}

export const HomePageHero = ({ mounted }: HomePageHeroProps) => (
  <Box className="home-page-hero">
    <Slide direction="down" in={mounted} timeout={800} easing={{ enter: 'cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <Box>
        <Typography
          variant="h1"
          className={`home-page-hero-title ${mounted ? 'home-page-title-animate' : ''}`}
        >
          Система бронирования столов
        </Typography>
        <Typography
          variant="h5"
          className={`home-page-hero-subtitle ${mounted ? 'home-page-subtitle-animate' : ''}`}
        >
          Удобное управление бронированиями для ресторанов и кафе
        </Typography>
      </Box>
    </Slide>
  </Box>
);
