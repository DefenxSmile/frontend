import { Box, Grow } from '@mui/material';
import { HomePageRoleCard, type RoleItem } from './HomePageRoleCard';

interface HomePageRoleCardsGridProps {
  roles: RoleItem[];
  mounted: boolean;
}

export const HomePageRoleCardsGrid = ({ roles, mounted }: HomePageRoleCardsGridProps) => (
  <Box className="home-page-cards-grid">
    {roles.map((role, index) => (
      <Grow
        in={mounted}
        timeout={1000}
        style={{
          transitionDelay: `${index * 150 + 300}ms`,
          transformOrigin: 'center bottom',
        }}
        key={role.title}
      >
        <Box sx={{ display: 'block', height: '100%' }}>
          <HomePageRoleCard role={role} />
        </Box>
      </Grow>
    ))}
  </Box>
);
