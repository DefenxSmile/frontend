import { Box, Container, Grow, Fade } from '@mui/material';
import { VenueForm, ConfirmDialog } from '../../components';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminVenueCard } from './AdminVenueCard';
import { AdminEmptyState } from './AdminEmptyState';
import type { VenueDto } from '../../types';
import './AdminPage.scss';

export interface AdminPagePresenterProps {
  mounted: boolean;
  venues: VenueDto[];
  venueForm: {
    open: boolean;
    editingVenue: VenueDto | null;
    formData: import('../../types').VenueRequestDto;
    isLoading: boolean;
    closeForm: () => void;
    submit: () => Promise<void>;
    setFormData: React.Dispatch<React.SetStateAction<import('../../types').VenueRequestDto>>;
  };
  confirmDialog: {
    open: boolean;
    options: { title: string; message: string; confirmText?: string; cancelText?: string; confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' };
    handleConfirm: () => void;
    handleCancel: () => void;
  };
  isDeleting: boolean;
  onAddVenue: () => void;
  onEditVenue: (venue: VenueDto) => void;
  onDeleteVenue: (id: number) => void;
}

export const AdminPagePresenter = ({
  mounted,
  venues,
  venueForm,
  confirmDialog,
  isDeleting,
  onAddVenue,
  onEditVenue,
  onDeleteVenue,
}: AdminPagePresenterProps) => (
  <Box className="admin-page">
    <Container maxWidth="lg">
      <Grow in={mounted} timeout={600}>
        <Box sx={{ display: 'block' }}>
          <AdminPageHeader onAddVenue={onAddVenue} />
        </Box>
      </Grow>

      {venues.length > 0 ? (
        <Box className="admin-page-grid">
          {venues.map((venue, index) => (
            <Grow in={mounted} timeout={600} style={{ transitionDelay: `${index * 100}ms` }} key={venue.id}>
              <Box sx={{ display: 'block', height: '100%' }}>
                <AdminVenueCard
                venue={venue}
                isDeleting={isDeleting}
                onEdit={() => onEditVenue(venue)}
                onDelete={() => onDeleteVenue(venue.id)}
              />
              </Box>
            </Grow>
          ))}
        </Box>
      ) : (
        <Fade in={mounted} timeout={600}>
          <Box sx={{ display: 'block' }}>
            <AdminEmptyState onAddVenue={onAddVenue} />
          </Box>
        </Fade>
      )}

      <VenueForm
        open={venueForm.open}
        venue={venueForm.editingVenue}
        formData={venueForm.formData}
        isLoading={venueForm.isLoading}
        onClose={venueForm.closeForm}
        onSubmit={venueForm.submit}
        onChange={venueForm.setFormData}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.options.title}
        message={confirmDialog.options.message}
        confirmText={confirmDialog.options.confirmText}
        cancelText={confirmDialog.options.cancelText}
        confirmColor={confirmDialog.options.confirmColor}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />
    </Container>
  </Box>
);
