import { Box, Grow } from '@mui/material';
import { UserPageTableCard } from './UserPageTableCard';
import type { FilteredReservationObject } from './types';

interface UserPageTablesGridProps {
  objects: FilteredReservationObject[];
  mounted: boolean;
  onTableClick: (objectId: number) => void;
}

export const UserPageTablesGrid = ({ objects, mounted, onTableClick }: UserPageTablesGridProps) => (
  <Box className="user-page-tables-grid">
    {objects.map((obj, index) => (
      <Grow in={mounted} timeout={600} style={{ transitionDelay: `${index * 100}ms` }} key={obj.id}>
        <Box sx={{ display: 'block', height: '100%' }}>
          <UserPageTableCard object={obj} onClick={() => onTableClick(obj.id)} />
        </Box>
      </Grow>
    ))}
  </Box>
);
