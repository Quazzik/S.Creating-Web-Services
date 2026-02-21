import React from 'react';
import {
  Layout,
  Menu,
  theme,
} from 'antd';
import { Link, Outlet } from 'umi';
import {
  HomeOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to="/">Главная</Link>,
    },
    {
      key: '2',
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">О программе</Link>,
    },
    {
      key: '3',
      icon: <FileTextOutlined />,
      label: <Link to="/feedback">Обратная связь</Link>,
    },
    {
      key: '4',
      icon: <DatabaseOutlined />,
      label: <Link to="/dictionaries">Редактирование справочников</Link>,
    },
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
    Ваша реклама
  </span>
</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
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
    </Layout>
  );
}