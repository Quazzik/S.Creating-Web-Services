import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import {Button, Layout, Menu, theme} from 'antd';
import { Link, Outlet } from 'umi';
import {HomeOutlined, InfoCircleOutlined, FileTextOutlined,
  DatabaseOutlined, ShoppingOutlined} from '@ant-design/icons';
import { authService } from '../services/auth';
import { AuthModal } from '../components/AuthModal';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

export default function BasicLayout() {
  const location = useLocation();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    history.push('/');
  };

  const handleLogin = () => {
    setIsAuthModalVisible(true);
    history.push('/');
  };

    const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalVisible(false);
  };

  useEffect(() => {
    const auth = authService.isAuthenticated();
    setIsAuthenticated(auth);
  }, [location.pathname]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const createMenuLabel = (text: string) => (
    <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.6', display: 'block' }}>{text}</span>
  );

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to="/">{createMenuLabel('Главная')}</Link>,
    },
    {
      key: '2',
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">{createMenuLabel('О программе')}</Link>,
    },
    {
      key: '3',
      icon: <FileTextOutlined />,
      label: <Link to="/feedback">{createMenuLabel('Обратная связь')}</Link>,
    },
    ...(isAuthenticated ? [{
      key: '4',
      icon: <DatabaseOutlined />,
      label: <Link to="/dictionaries">{createMenuLabel('Редактирование справочников')}</Link>,
    }] : []),
    ...(isAuthenticated ? [{
      key: '5',
      icon: <ShoppingOutlined />,
      label: <Link to="/cars">{createMenuLabel('Каталог автомобилей')}</Link>,
    }] : []),
  ];

  return (
    <Layout hasSider>
      <Sider>
        <div style={{ 
            height: 64, 
            margin: '16px 0', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
          <span style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            letterSpacing: 0.5,
          }}>
            {isAuthenticated ? <Button size="large" type="primary" onClick={() => handleLogout()}>
          Выход ({authService.getUser()?.login || 'Noname'})
        </Button> : <Button size="large" type="primary" onClick={() => handleLogin()}>
          Войти
        </Button>}  
  </span>
</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          className="custom-menu"
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: '100vh',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
      <AuthModal
              visible={isAuthModalVisible}
              onSuccess={handleAuthSuccess}
            />
    </Layout>
  );
}