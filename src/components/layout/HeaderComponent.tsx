import React, { useState } from 'react';
import { Dropdown, Avatar, Badge, Menu, Space } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import LogoComponent from '@components/layout/LogoComponent';
// import NavMenuComponent from '@components/layout/NavMenuComponent';
import { clearUser, getUser } from '@utils/auth';
import logger from '@utils/logger';

import './HeaderComponent.css';

const HeaderComponent = () => {
  const [username, _] = useState(getUser()?.username);
  const navigate = useNavigate();
  const hasNotices = useAppSelector(state => {
    // 返回 array 会导致每次检测到新结果，不停的刷新此界面
    return (
      state.notices.filter(notice => {
        return !notice.isRead;
      }).length > 0
    );
  });

  const popMenu: MenuProps['items'] = [
    {
      key: 'notices',
      label: '通知中心',
    },
    {
      key: 'logout',
      label: '退出',
    },
  ];
  const handleClickPopMenu: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'logout':
        logger.info('logout click');
        clearUser();
        navigate('/login', { replace: true });
        break;
      case 'notices':
        navigate('/admin/notices');
        logger.info('notices click');
        break;
      default:
        logger.info('unknown key:', key);
        break;
    }
  };

  return (
    <>
      <LogoComponent />
      {/* <NavMenuComponent /> */}
      <Dropdown
        className='dropdown'
        menu={{ items: popMenu, onClick: handleClickPopMenu }}
      >
        <Space className='user'>
          <Avatar>
            <UserOutlined />
          </Avatar>
          <Badge dot={hasNotices}>
            <span style={{ color: 'white' }}>{username}</span>
          </Badge>
          <DownOutlined className='downLine' style={{ color: 'white' }} />
        </Space>
      </Dropdown>
    </>
  );
};

export default HeaderComponent;
