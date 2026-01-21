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
        className={`bg-[#FF6B01] rounded-none ${
          mode === 'light' ? 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
        }`}
      >
        <Toolbar className="px-4 sm:px-6">
          <Box 
            component={Link}
            to="/"
            className="flex-grow flex items-center gap-3 no-underline cursor-pointer hover:opacity-90 transition-opacity duration-200"
          >
            <Box
              component="img"
              src={logoIcon}
              alt="TableBook Logo"
              className="w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] brightness-0 invert transition-transform duration-200 hover:scale-105"
            />
            <Typography 
              variant="h6" 
              component="div" 
              className="font-bold text-white text-[1.1rem] sm:text-[1.35rem] tracking-wide bg-gradient-to-br from-white to-[#F5F5F5] bg-clip-text text-transparent"
            >
              TableBook
            </Typography>
          </Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            className={`mx-1 rounded-none ${
              location.pathname === '/' ? 'border-b-2 border-white' : ''
            }`}
          >
            Главная
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/admin"
            className={`mx-1 rounded-none ${
              location.pathname === '/admin' || location.pathname.startsWith('/admin/') ? 'border-b-2 border-white' : ''
            }`}
          >
            Админ
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/user"
            className={`mx-1 rounded-none ${
              location.pathname === '/user' ? 'border-b-2 border-white' : ''
            }`}
          >
            Пользователь
          </Button>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            className="ml-4"
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

