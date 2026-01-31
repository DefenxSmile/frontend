import { useState, useEffect } from 'react';
import {
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { HomePagePresenter } from './HomePagePresenter';
import type { RoleItem } from './HomePageRoleCard';

const ROLES: RoleItem[] = [
  {
    icon: AdminIcon,
    title: 'Администратор',
    description: 'Управляйте заведениями: создавайте, редактируйте и удаляйте компании-клиенты',
    link: '/admin',
    buttonText: 'Перейти в админ-панель',
    cardClass: 'role-card--admin',
  },
  {
    icon: BusinessIcon,
    title: 'Заведение',
    description: 'Управляйте объектами бронирования (столы, диваны) и просматривайте все бронирования',
    link: '/venue',
    buttonText: 'Управление заведением',
    cardClass: 'role-card--venue',
  },
  {
    icon: PersonIcon,
    title: 'Гость',
    description: 'Бронируйте столы в заведениях, выбирайте дату, время и управляйте своими бронированиями',
    link: '/user',
    buttonText: 'Забронировать стол',
    cardClass: 'role-card--guest',
  },
];

export const HomePageContainer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <HomePagePresenter mounted={mounted} roles={ROLES} />;
};
