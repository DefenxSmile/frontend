import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import type { ComponentType } from 'react';

export interface RoleItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  cardClass: string;
}

interface HomePageRoleCardProps {
  role: RoleItem;
  mounted?: boolean;
  index?: number;
}

export const HomePageRoleCard = ({ role }: HomePageRoleCardProps) => {
  const IconComponent = role.icon;
  return (
    <Card className={`role-card ${role.cardClass}`}>
      <CardContent className="home-page-card-content">
        <Box className="home-page-icon-container">
          <IconComponent className="home-page-role-icon" />
        </Box>
        <Typography variant="h5" className="home-page-role-title">
          {role.title}
        </Typography>
        <Typography variant="body1" className="home-page-role-description">
          {role.description}
        </Typography>
        <Button className="role-button" component={Link} to={role.link} variant="contained" fullWidth>
          {role.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
