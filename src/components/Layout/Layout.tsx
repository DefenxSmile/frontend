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
      <AppBar position="static" className="layout-appbar">
        <Toolbar className="layout-toolbar">
          <Box component={Link} to="/" className="layout-logo">
            <Typography variant="h6" component="div" className="layout-logo-text">
              TableBook
            </Typography>
          </Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            className={`layout-nav-btn ${location.pathname === '/' ? 'layout-nav-btn--active' : ''}`}
          >
            Главная
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/admin"
            className={`layout-nav-btn ${location.pathname === '/admin' || location.pathname.startsWith('/admin/') ? 'layout-nav-btn--active' : ''}`}
          >
            Админ
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/venue"
            className={`layout-nav-btn ${location.pathname === '/venue' || location.pathname.startsWith('/venue/') ? 'layout-nav-btn--active' : ''}`}
          >
            Заведение
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/user"
            className={`layout-nav-btn ${location.pathname === '/user' ? 'layout-nav-btn--active' : ''}`}
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

