import { type ReactNode } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '../../contexts/ThemeContext'
import './Layout.scss'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const { mode, toggleTheme } = useTheme()

  return (
    <Box className="layout">
      <AppBar 
        position="static"
        sx={{
          backgroundColor: '#FF6B01',
          borderRadius: 0,
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            TableBook
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            sx={{
              mx: 0.5,
              borderRadius: 0,
              '&.active': {
                borderBottom: '2px solid #FFFFFF',
              },
            }}
          >
            Главная
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/admin"
            className={location.pathname === '/admin' || location.pathname.startsWith('/admin/') ? 'active' : ''}
            sx={{
              mx: 0.5,
              borderRadius: 0,
              '&.active': {
                borderBottom: '2px solid #FFFFFF',
              },
            }}
          >
            Админ
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/user"
            className={location.pathname === '/user' ? 'active' : ''}
            sx={{
              mx: 0.5,
              borderRadius: 0,
              '&.active': {
                borderBottom: '2px solid #FFFFFF',
              },
            }}
          >
            Пользователь
          </Button>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ ml: 2 }}
            aria-label="Переключить тему"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" className="layout-content">
        {children}
      </Box>
    </Box>
  )
}

export default Layout

