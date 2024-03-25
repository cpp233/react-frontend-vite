import React, { useState, useEffect } from 'react';
import type { MenuProps } from 'antd';
import type { ItemType } from 'antd/es/menu/hooks/useItems';

import MenuComponent from '@components/layout/MenuComponent';
import { routesMap, routesMap2 } from '@routers/routesMap';
import { autoRouters } from '@routers/autoRouters';
import logger from '@utils/logger';

type MenuItem = Required<MenuProps>['items'][number];

// 废弃
const helper_initSideItemList = (
  routesMap: routesMapType[],
  parent?: routesMapType
): MenuProps['items'] => {
  const sideItemList: MenuProps['items'] = [];

  for (let i = 0; i < routesMap.length; ++i) {
    const curRoute = routesMap[i];

    if (curRoute.redirect || curRoute.hide) {
      continue;
    }

    // const sideItem: MenuItem = {
    //   children: undefined,
    // };
    let children = undefined;
    let key = undefined;
    let label = undefined;
    let icon = undefined;

    if (curRoute.children && curRoute.children.length > 0) {
      // sideItem.children = helper_initSideItemList(curRoute.children, curRoute);
      children = helper_initSideItemList(curRoute.children, curRoute);
    }

    // sideItem.key = parent ? parent.path + '/' + curRoute.path : curRoute.path;

    // sideItem.key = curRoute.path;
    // sideItem.label = curRoute.title;
    // sideItem.icon = curRoute.icon;

    key = curRoute.path;
    label = curRoute.title;
    icon = curRoute.icon;

    // sideItemList.push(sideItem);
    sideItemList.push({ children, key, label, icon } as MenuItem);
  }
  return sideItemList;
};

type RouteMapType = routesMapType[] | autoRoutesType[];

function makeSideItemList<T extends RouteMapType>(
  routesMap: T,
  parentPath?: string
): ItemType[] {
  if (!routesMap) {
    return [];
  }

  const result: ItemType[] = [];

  for (const route of routesMap) {
    const path = parentPath ? parentPath + '/' + route.path : route.path;
    // logger.trace({ path, parentPath, route: route.path });

    if (route.hide && route.children) {
      const hideWithChildren = makeSideItemList(route.children, route.path);
      result.push(...hideWithChildren);
    }

    const sideItem: ItemType = {
      key: path,
      label: route.title,
      icon: route.icon,
      children: route.children && makeSideItemList(route.children),
    };

    if (!route.hide) {
      result.push(sideItem);
    }
  }

  return result;
}

function SideMenuComponent() {
  const [items, setItems] = useState<ItemType[]>([]);

  useEffect(() => {
    // const sideMenuItemList = helper_initSideItemList(routesMap);
    // const sideMenuItemList2 =
    //   makeSideItemList<routesMapType[]>(routesMap2) || [];
    const tree = autoRouters.resultTree;
    if (!tree) {
      return;
    }
    const sideMenuItemList5 = makeSideItemList<autoRoutesType[]>(tree);

    setItems(sideMenuItemList5);
    // logger.trace({
    //   routesMap2,
    //   resultTree: autoRouters.resultTree,
    //   resultArr: autoRouters.resultArr,
    // });
    // logger.trace(
    //   autoRouters.resultArr.map(item => {
    //     console.log(item.path);
    //   })
    // );
    // logger.info({ sideMenuItemList2, sideMenuItemList3, sideMenuItemList4 });
    // logger.info({ routesMap2, sideMenuItemList3 });
  }, []);

  return <MenuComponent mode='inline' items={items}></MenuComponent>;
}

export default SideMenuComponent;
