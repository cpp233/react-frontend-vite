import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

import { getType } from '@utils/utils';
import logger from '@utils/logger';

type FlattenRoutesMap = Map<string | RegExp, string>;

// 采用 useLocation 生成
const BreadcrumbComponent = () => {
  const { pathname } = useLocation();
  const _params = useParams();

  const makeBreadcrumbs = () => {
    const segments = pathname.split('/');
    const result: ItemType[] = [];

    result.push({
      title: <Link to='/'>Home</Link>,
      key: 'home',
    });

    segments.reduce((previousValue, currentValue) => {
      const path = `${previousValue}/${currentValue}`;
      result.push({
        key: currentValue,
        title: <Link to={path}>{currentValue}</Link>,
      });
      // logger.trace({ pathname, path, previousValue, currentValue });
      return path;
    });
    // logger.trace({ result });
    return result;
  };

  return <Breadcrumb items={makeBreadcrumbs()} />;
};

export default BreadcrumbComponent;
