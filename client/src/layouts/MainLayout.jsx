import { useMemo } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Layout, Space, Tag, theme } from 'antd';
import {
  CarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Header, Content, Footer } = Layout;

const NAV_ITEMS = [
  { to: '/', label: 'Browse cars', icon: <CarOutlined /> },
  { to: '/my-bookings', label: 'My bookings', icon: <ProfileOutlined /> },
];

const MainLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const navItems = useMemo(
    () => (isAdmin ? [...NAV_ITEMS, { to: '/admin', label: 'Admin', icon: <DashboardOutlined /> }] : NAV_ITEMS),
    [isAdmin]
  );

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-brand">
            <span className="app-brand__mark">
              <CarOutlined />
            </span>
            <span className="app-brand__text">Car Rental</span>
          </Link>

          <nav className="app-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Space size="middle">
            {isAdmin && (
              <Tag color="geekblue" bordered={false} className="role-tag">
                Admin
              </Tag>
            )}
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <Button className="user-button" type="text">
                <Avatar size={28} icon={<UserOutlined />} style={{ background: token.colorPrimary }} />
                <span className="user-button__name">{user?.username}</span>
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Header>

      <Content className="app-content">
        <Outlet />
      </Content>

      <Footer className="app-footer">
        <span>Car Rental · Built with React, Vite and Ant Design</span>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
