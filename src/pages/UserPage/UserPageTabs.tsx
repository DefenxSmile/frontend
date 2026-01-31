import { Box, Tabs, Tab } from '@mui/material';
import { CalendarToday as CalendarIcon, TableRestaurant as TableIcon } from '@mui/icons-material';

interface UserPageTabsProps {
  value: number;
  onChange: (_: React.SyntheticEvent, value: number) => void;
}

export const UserPageTabs = ({ value, onChange }: UserPageTabsProps) => (
  <Box className="user-page-tabs-wrap">
    <Tabs value={value} onChange={onChange} className="user-page-tabs">
      <Tab label="Забронировать" icon={<CalendarIcon className="user-page-icon-primary" />} iconPosition="start" />
      <Tab label="Мои бронирования" icon={<TableIcon className="user-page-icon-primary" />} iconPosition="start" />
    </Tabs>
  </Box>
);
