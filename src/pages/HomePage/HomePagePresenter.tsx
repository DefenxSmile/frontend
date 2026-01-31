import { Box, Container } from '@mui/material';
import { HomePageHero } from './HomePageHero';
import { HomePageRoleCardsGrid } from './HomePageRoleCardsGrid';
import { HomePageHint } from './HomePageHint';
import type { RoleItem } from './HomePageRoleCard';
import './HomePage.scss';

export interface HomePagePresenterProps {
  mounted: boolean;
  roles: RoleItem[];
}

export const HomePagePresenter = ({ mounted, roles }: HomePagePresenterProps) => (
  <Box className="home-page">
    <Container maxWidth="lg">
      <HomePageHero mounted={mounted} />
      <HomePageRoleCardsGrid roles={roles} mounted={mounted} />
      <HomePageHint mounted={mounted} />
    </Container>
  </Box>
);
