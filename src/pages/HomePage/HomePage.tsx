import { Container, Typography, Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import './HomePage.scss'

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box 
        className="home-page"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Добро пожаловать в TableBook
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Система бронирования столов в ресторанах и заведениях
        </Typography>
        <Box className="home-page__actions" mt={4}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/admin"
            sx={{ 
              mr: 2,
              backgroundColor: '#FF6B01',
              '&:hover': {
                backgroundColor: '#E55A00',
              },
            }}
          >
            Панель администратора
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/user"
          >
            Панель пользователя
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default HomePage

