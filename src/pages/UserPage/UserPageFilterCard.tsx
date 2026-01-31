import { Box, Card, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { AccessTime as TimeIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
interface UserPageFilterCardProps {
  filterDate: Date | null;
  filterTimeSlot: string;
  timeSlots: string[];
  onDateChange: (date: Date | null) => void;
  onTimeSlotChange: (time: string) => void;
}

export const UserPageFilterCard = ({
  filterDate,
  filterTimeSlot,
  timeSlots,
  onDateChange,
  onTimeSlotChange,
}: UserPageFilterCardProps) => (
  <Card className="user-page-filter-card">
    <Box className="user-page-filter-header">
      <TimeIcon className="user-page-icon-primary user-page-icon-primary--lg" />
      <Typography variant="h6" className="user-page-typography-section">
        Фильтр по времени
      </Typography>
    </Box>
    <Box className="user-page-filter-grid">
      <Box>
        <Box className="user-page-filter-field-label">
          <CalendarIcon className="user-page-icon-primary" />
          <Typography variant="body2" className="user-page-typography-label">
            Дата
          </Typography>
        </Box>
        <DatePicker
          value={filterDate}
          onChange={onDateChange}
          format="dd MMMM yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              className: 'user-page-outlined-input',
            },
          }}
        />
      </Box>
      <Box>
        <Box className="user-page-filter-field-label">
          <TimeIcon className="user-page-icon-primary" />
          <Typography variant="body2" className="user-page-typography-label">
            Время
          </Typography>
        </Box>
        <FormControl fullWidth>
          <Select
            value={filterTimeSlot}
            onChange={(e) => onTimeSlotChange(e.target.value)}
            displayEmpty
            className="user-page-outlined-input"
          >
            <MenuItem value="">
              <em>Все время</em>
            </MenuItem>
            {timeSlots.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  </Card>
);
