import { Box, Tabs, Tab } from '@mui/material';
import { TableRestaurant as TableIcon, Event as EventIcon } from '@mui/icons-material';

interface VenuePageTabsProps {
  value: number;
  onChange: (_: React.SyntheticEvent, newValue: number) => void;
}

export const VenuePageTabs = ({ value, onChange }: VenuePageTabsProps) => (
  <Box className="venue-page-tabs-wrap">
    <Tabs value={value} onChange={onChange} className="venue-page-tabs">
      <Tab
        label="Объекты бронирования"
        icon={<TableIcon style={{ fontSize: 20, marginRight: 8 }} />}
        iconPosition="start"
      />
      <Tab
        label="Бронирования"
        icon={<EventIcon style={{ fontSize: 20, marginRight: 8 }} />}
        iconPosition="start"
      />
    </Tabs>
  </Box>
);
