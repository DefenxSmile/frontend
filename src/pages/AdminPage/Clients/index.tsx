import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material'
import { useVenues, useDeleteVenue } from '../../../domain/hooks'
import ClientFormDrawer from '../../../components/ClientFormDrawer/ClientFormDrawer'
import './index.scss'

const AdminClientsPage = () => {
  const navigate = useNavigate()
  const { data: venues, isLoading, error } = useVenues()
  const deleteVenue = useDeleteVenue()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingClientId, setEditingClientId] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, clientId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedClientId(clientId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedClientId(null)
  }

  const isMenuOpen = Boolean(anchorEl)

  const handleCreatePlan = () => {
    if (selectedClientId) {
      navigate(`/admin/editor/${selectedClientId}`)
      handleMenuClose()
    }
  }

  const handleEditPlan = () => {
    if (selectedClientId) {
      navigate(`/admin/editor/${selectedClientId}`)
      handleMenuClose()
    }
  }

  const handleView = () => {
    if (selectedClientId) {
      navigate(`/admin/viewer/${selectedClientId}`)
      handleMenuClose()
    }
  }

  const handleEditClient = () => {
    if (selectedClientId) {
      setEditingClientId(selectedClientId)
      setDrawerOpen(true)
      handleMenuClose()
    }
  }

  const handleDelete = () => {
    if (selectedClientId) {
      const venueId = Number(selectedClientId)
      if (!isNaN(venueId) && window.confirm('Вы уверены, что хотите удалить этого клиента? Все связанные планы также будут удалены.')) {
        deleteVenue.mutate(venueId, {
          onSuccess: () => {
            handleMenuClose()
          },
        })
      } else {
        handleMenuClose()
      }
    }
  }

  const handleAddNew = () => {
    setEditingClientId(null)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setEditingClientId(null)
  }

  const handleClientSave = () => {
  }

  return (
    <Box 
      className="admin-clients-page" 
      sx={{ 
        minHeight: 'calc(100vh - 64px)', 
        py: 4,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Управление клиентами
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              backgroundColor: '#FF6B01',
              '&:hover': {
                backgroundColor: '#E55A00',
              },
            }}
          >
            Добавить клиента
          </Button>
        </Box>

        <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Клиент</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Заведение</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Контакты</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Статус</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Дата создания</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '14px', textAlign: 'center' }}>
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Alert severity="error">Ошибка загрузки данных: {error.message}</Alert>
                    </TableCell>
                  </TableRow>
                ) : !venues || venues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        Нет клиентов. Добавьте первого клиента, нажав кнопку "Добавить клиента".
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  venues.map((venue) => {
                    const client = venue.floorPlan.metadata
                    if (!client) return null
                    
                    return (
                    <TableRow
                      key={venue.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {client.clientName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {client.venueName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            -
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={venue.floorPlan.floors.length > 0 ? 'План создан' : 'Без плана'}
                          size="small"
                          color={venue.floorPlan.floors.length > 0 ? 'success' : 'default'}
                          sx={{
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {client.createdAt ? new Date(client.createdAt).toLocaleDateString('ru-RU') : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Действия">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, String(venue.id))}
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Контекстное меню */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <MenuItem onClick={handleEditClient}>
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: '#FF6B01' }} />
            </ListItemIcon>
            <ListItemText>Редактировать клиента</ListItemText>
          </MenuItem>
          {selectedClientId && (
            <>
              {venues?.find((v) => String(v.id) === selectedClientId)?.floorPlan.floors.length ? (
                <>
                  <MenuItem onClick={handleEditPlan}>
                    <ListItemIcon>
                      <ConstructionIcon fontSize="small" sx={{ color: '#9C27B0' }} />
                    </ListItemIcon>
                    <ListItemText>Редактировать план</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleView}>
                    <ListItemIcon>
                      <ViewIcon fontSize="small" sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    <ListItemText>Просмотреть план</ListItemText>
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleCreatePlan}>
                  <ListItemIcon>
                    <ConstructionIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText>Создать план</ListItemText>
                </MenuItem>
              )}
            </>
          )}
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleDelete} sx={{ color: '#F44336' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: '#F44336' }} />
            </ListItemIcon>
            <ListItemText>Удалить</ListItemText>
          </MenuItem>
        </Menu>

        {/* Drawer для добавления/редактирования клиента */}
        <ClientFormDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          clientId={editingClientId}
          onSave={handleClientSave}
        />
      </Container>
    </Box>
  )
}

export default AdminClientsPage

