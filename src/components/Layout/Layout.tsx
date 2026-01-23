import { type ReactNode } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import './Layout.scss'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  return (
    <Box className="layout">
      <AppBar 
        position="static"
        sx={{
          backgroundColor: '#3B82F6',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar className="px-4 sm:px-6">
          <Box 
            component={Link}
            to="/"
            className="flex-grow flex items-center gap-3 no-underline cursor-pointer hover:opacity-90 transition-opacity duration-200"
          >
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
            to="/venue"
            className={`mx-1 rounded-none ${
              location.pathname === '/venue' || location.pathname.startsWith('/venue/') ? 'border-b-2 border-white' : ''
            }`}
          >
            Заведение
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/user"
            className={`mx-1 rounded-none ${
              location.pathname === '/user' ? 'border-b-2 border-white' : ''
            }`}
          >
            Гость
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" className="layout-content">
        {children}
      </Box>
    </Box>
  )
}

export default Layout

