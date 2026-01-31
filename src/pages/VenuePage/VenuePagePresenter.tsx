import { Box, Container, Grow, Fade, Alert } from '@mui/material';
import { ReservationObjectForm, ConfirmDialog } from '../../components';
import { VenuePageHeader } from './VenuePageHeader';
import { VenuePageTabs } from './VenuePageTabs';
import { VenuePageObjectsSection } from './VenuePageObjectsSection';
import { VenuePageBookingsSection } from './VenuePageBookingsSection';
import type { VenueDto, ReservationObjectDto, ReservationDto } from '../../types';
import './VenuePage.scss';

export interface VenuePagePresenterProps {
  mounted: boolean;
  selectedVenueId: number | null;
  selectedTab: number;
  venues: VenueDto[] | undefined;
  reservationObjects: ReservationObjectDto[];
  reservations: ReservationDto[];
  objectsLoading: boolean;
  reservationsLoading: boolean;
  objectForm: {
    open: boolean;
    editingObject: ReservationObjectDto | null;
    formData: import('../../types').ReservationObjectRequestDto;
    isLoading: boolean;
    closeForm: () => void;
    submit: () => Promise<void>;
    setFormData: React.Dispatch<React.SetStateAction<import('../../types').ReservationObjectRequestDto>>;
  };
  confirmDialog: {
    open: boolean;
    options: { title: string; message: string; confirmText?: string; cancelText?: string; confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' };
    handleConfirm: () => void;
    handleCancel: () => void;
  };
  onVenueChange: (venueId: number) => void;
  onTabChange: (_: React.SyntheticEvent, value: number) => void;
  onAddObject: () => void;
  onEditObject: (obj: ReservationObjectDto) => void;
  onDeleteObject: (id: number) => void;
}

export const VenuePagePresenter = ({
  mounted,
  selectedVenueId,
  selectedTab,
  venues,
  reservationObjects,
  reservations,
  objectsLoading,
  reservationsLoading,
  objectForm,
  confirmDialog,
  onVenueChange,
  onTabChange,
  onAddObject,
  onEditObject,
  onDeleteObject,
}: VenuePagePresenterProps) => (
  <Box className="venue-page">
    <Container maxWidth="lg">
      <Grow in={mounted} timeout={600}>
        <Box sx={{ display: 'block' }}>
          <VenuePageHeader venues={venues} selectedVenueId={selectedVenueId} onVenueChange={onVenueChange} />
        </Box>
      </Grow>

      {selectedVenueId && (
        <>
          <Grow in={mounted} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Box sx={{ display: 'block' }}>
              <VenuePageTabs value={selectedTab} onChange={onTabChange} />
            </Box>
          </Grow>

          {selectedTab === 0 && (
            <Fade in={selectedTab === 0} timeout={300}>
              <Box sx={{ display: 'block' }}>
                <VenuePageObjectsSection
                  mounted={mounted}
                  objects={reservationObjects}
                  isLoading={objectsLoading}
                  onAddObject={onAddObject}
                  onEditObject={onEditObject}
                  onDeleteObject={onDeleteObject}
                />
              </Box>
            </Fade>
          )}

          {selectedTab === 1 && (
            <Fade in={selectedTab === 1} timeout={300}>
              <Box sx={{ display: 'block' }}>
                <VenuePageBookingsSection reservations={reservations} isLoading={reservationsLoading} />
              </Box>
            </Fade>
          )}
        </>
      )}

      {!selectedVenueId && (
        <Alert severity="info" className="venue-page-info-alert">
          Выберите заведение для управления объектами бронирования и просмотра бронирований
        </Alert>
      )}

      <ReservationObjectForm
        open={objectForm.open}
        object={objectForm.editingObject}
        formData={objectForm.formData}
        isLoading={objectForm.isLoading}
        onClose={objectForm.closeForm}
        onSubmit={objectForm.submit}
        onChange={objectForm.setFormData}
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
