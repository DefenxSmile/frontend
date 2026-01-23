import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Container, Grow, Slide } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import './HomePage.scss';

const HomePage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = [
    {
      icon: AdminIcon,
      title: 'Администратор',
      description: 'Управляйте заведениями: создавайте, редактируйте и удаляйте компании-клиенты',
      link: '/admin',
      buttonText: 'Перейти в админ-панель',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: BusinessIcon,
      title: 'Заведение',
      description: 'Управляйте объектами бронирования (столы, диваны) и просматривайте все бронирования',
      link: '/venue',
      buttonText: 'Управление заведением',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: PersonIcon,
      title: 'Гость',
      description: 'Бронируйте столы в заведениях, выбирайте дату, время и управляйте своими бронированиями',
      link: '/user',
      buttonText: 'Забронировать стол',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        paddingTop: { xs: '48px', sm: '64px' },
        paddingBottom: '64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Заголовок */}
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: { xs: '48px', sm: '64px' },
          }}
        >
          <Slide direction="down" in={mounted} timeout={800} easing={{ enter: 'cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                  color: '#1F2937',
                  marginBottom: '16px',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  animation: mounted ? 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both' : 'none',
                }}
              >
                Система бронирования столов
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#6B7280',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 400,
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  animation: mounted ? 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both' : 'none',
                }}
              >
                Удобное управление бронированиями для ресторанов и кафе
              </Typography>
            </Box>
          </Slide>
        </Box>

        {/* Карточки ролей */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: { xs: '24px', sm: '32px' },
            marginBottom: '48px',
          }}
        >
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <Grow
                in={mounted}
                timeout={1000}
                style={{
                  transitionDelay: `${index * 150 + 300}ms`,
                  transformOrigin: 'center bottom',
                }}
                key={role.title}
              >
                <Card
                  className="role-card"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                    overflow: 'visible',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '24px',
                      background: role.gradient,
                      opacity: 0,
                      transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 0,
                    },
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                      '&::before': {
                        opacity: 0.05,
                      },
                      '& .role-button': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      padding: { xs: '32px 24px', sm: '40px 32px' },
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Иконка */}
                    <Box
                      className="icon-container"
                      sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: role.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <IconComponent
                        className="role-icon"
                        sx={{
                          fontSize: '40px',
                          color: 'white',
                        }}
                      />
                    </Box>

                    {/* Заголовок */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        color: '#1F2937',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {role.title}
                    </Typography>

                    {/* Описание */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#6B7280',
                        fontSize: '0.9375rem',
                        lineHeight: 1.7,
                        marginBottom: '32px',
                        flex: 1,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {role.description}
                    </Typography>

                    {/* Кнопка */}
                    <Button
                      className="role-button"
                      component={Link}
                      to={role.link}
                      variant="contained"
                      fullWidth
                      sx={{
                        background: role.gradient,
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        padding: '14px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                          transition: 'left 0.5s ease',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                        },
                            '&:active': {
                              transform: 'translateY(-2px)',
                              transition: 'transform 0.1s ease',
                            },
                      }}
                    >
                      {role.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grow>
            );
          })}
        </Box>

        {/* Подсказка */}
        <Slide direction="up" in={mounted} timeout={1000} style={{ transitionDelay: '800ms' }}>
          <Box
            sx={{
              textAlign: 'center',
              paddingTop: '32px',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#9CA3AF',
                fontSize: '0.875rem',
                fontWeight: 400,
                animation: mounted ? 'fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) 1s both' : 'none',
              }}
            >
              Выберите роль для входа в систему
            </Typography>
          </Box>
        </Slide>
      </Container>
    </Box>
  );
};

export default HomePage;
