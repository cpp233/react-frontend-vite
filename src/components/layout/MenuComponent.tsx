import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { ItemType } from 'antd/es/menu/hooks/useItems';
import { useLocation, useNavigate } from 'react-router-dom';

import logger from '@utils/logger';

type MenuItem = Required<MenuProps>['items'][number];

interface Props extends MenuProps {
  items: MenuItem[];
}

function MenuComponent({ theme, mode, defaultSelectedKeys: _, items }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const selectAfterRefresh = () => {
    const pathList = pathname.split('/');
    const selectedKeys: string[] = [];
    const openKeys: string[] = [];

    if (!items) {
      return { selectedKeys, openKeys };
    }

    const helper_isSelect = (
      items: ItemType[],
      selectedKeys: string[],
      openKeys: string[]
    ) => {
      for (const item of items) {
        if (!item) {
          continue;
        }
        const key = String(item.key);

        // 含有 children，同时还有子节点，保持打开
        // @ts-expect-error: Property 'children' does not exist on type 'ItemType'.
        if (item?.children && pathname.includes(key)) {
          openKeys.push(key);
        }
        // @ts-expect-error: Property 'children' does not exist on type 'ItemType'.
        if (item?.children) {
          // @ts-expect-error: Property 'children' does not exist on type 'ItemType'.
          helper_isSelect(item.children, selectedKeys, openKeys);
        }
        // 不含有 children，就是 selectedKeys
        // @ts-expect-error: Property 'children' does not exist on type 'ItemType'.
        if (!item?.children && pathname.includes(key)) {
          selectedKeys.push(key);
        }
      }
    };

    helper_isSelect(items, selectedKeys, openKeys);

    // logger.trace(items);
    return { selectedKeys, openKeys };
  };

  useEffect(() => {
    const { selectedKeys, openKeys } = selectAfterRefresh();
    logger.trace({ selectedKeys, openKeys, items });
    setOpenKeys(openKeys);
    setSelectedKeys(selectedKeys);
  }, [pathname, items]);

  const handleOpenChange: MenuProps['onOpenChange'] = keys => {
    // logger.info(keys);
    setOpenKeys(keys);
  };
  const handleMenuClick: MenuProps['onClick'] = ({ key: _key, keyPath }) => {
    // logger.info(keyPath.reduce((item, pre) => pre + '/' + item));
    const path = keyPath.reduce((item, pre) => pre + '/' + item);
    // logger.info({ path });
    // logger.info({ key, keyPath });

    navigate(`${path}`);
  };
  // const handleSelectChange: MenuProps['onSelect'] = ({
  //   key,
  //   keyPath,
  //   selectedKeys,
  // }) => {
  //   // logger.info({ key, keyPath, selectedKeys });
  //   setSelectedKeys(selectedKeys);
  // };
  return (
    <Menu
      theme={theme}
      mode={mode}
      defaultOpenKeys={openKeys}
      defaultSelectedKeys={selectedKeys}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={handleOpenChange}
      // onSelect={handleSelectChange}
      style={{ height: '100%', borderRight: 0 }}
      onClick={handleMenuClick}
      items={items}
    ></Menu>
  );
}

export default MenuComponent;
