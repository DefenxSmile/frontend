import { type ReactNode } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '../../contexts/ThemeContext'
import logoIcon from '../../assets/logo-icon.svg'
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
          <Box 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
              transition: 'opacity 0.2s ease',
            }}
          >
            <Box
              component="img"
              src={logoIcon}
              alt="TableBook Logo"
              sx={{
                width: { xs: 34, sm: 42 },
                height: { xs: 34, sm: 42 },
                filter: 'brightness(0) invert(1)', // Делает иконку белой
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: '#FFFFFF',
                fontSize: { xs: '1.1rem', sm: '1.35rem' },
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              TableBook
            </Typography>
          </Box>
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

