import { useState, useEffect } from 'react'
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
} from '@mui/material'
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { getClients, deleteClient, initializeMockData, type StoredClient } from '../../utils/storage'
import './AdminClientsPage.scss'

const AdminClientsPage = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState<StoredClient[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  useEffect(() => {
    initializeMockData()
    setClients(getClients())
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, clientId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedClientId(clientId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedClientId(null)
  }

  const isMenuOpen = Boolean(anchorEl)

  const handleEdit = () => {
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

  const handleDelete = () => {
    if (selectedClientId) {
      if (window.confirm('Вы уверены, что хотите удалить этого клиента? Все связанные планы также будут удалены.')) {
        deleteClient(selectedClientId)
        setClients(getClients())
      }
      handleMenuClose()
    }
  }

  const handleAddNew = () => {
    const newId = `client-${Date.now()}`
    navigate(`/admin/editor/${newId}?new=true`)
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
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        Нет клиентов. Добавьте первого клиента, нажав кнопку "Добавить клиента".
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow
                      key={client.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {client.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {client.venueName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {client.email && (
                            <Typography variant="caption" color="text.secondary">
                              {client.email}
                            </Typography>
                          )}
                          {client.phone && (
                            <Typography variant="caption" color="text.secondary">
                              {client.phone}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={client.hasFloorPlan ? 'План создан' : 'Без плана'}
                          size="small"
                          color={client.hasFloorPlan ? 'success' : 'default'}
                          sx={{
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(client.createdAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Действия">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, client.id)}
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
                  ))
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
              minWidth: 180,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: '#FF6B01' }} />
            </ListItemIcon>
            <ListItemText>Редактировать план</ListItemText>
          </MenuItem>
          {selectedClientId && clients.find((c) => c.id === selectedClientId)?.hasFloorPlan && (
            <MenuItem onClick={handleView}>
              <ListItemIcon>
                <ViewIcon fontSize="small" sx={{ color: '#2196F3' }} />
              </ListItemIcon>
              <ListItemText>Просмотреть план</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={handleDelete} sx={{ color: '#F44336' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: '#F44336' }} />
            </ListItemIcon>
            <ListItemText>Удалить</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  )
}

export default AdminClientsPage

