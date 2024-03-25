import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

import HeaderComponent from '@components/layout/HeaderComponent';
import SideMenuComponent from '@components/layout/SideMenuComponent';
import BreadcrumbComponent from '@components/layout/BreadcrumbComponent';

const LayoutPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className='header'>
        <HeaderComponent></HeaderComponent>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <SideMenuComponent />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <BreadcrumbComponent></BreadcrumbComponent>
          <Content
            style={{
              padding: 24,
              // backgroundColor: 'pink',
              // height: '100%',
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2024 Created by O.o
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
