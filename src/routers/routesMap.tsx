import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  ExperimentOutlined,
  DashboardOutlined,
  AreaChartOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import Dashboard from '@pages/admin/dashboard/Page';
import Notices from '@pages/admin/notices/Page';
import ItemTable from '@pages/admin/items/Page';
import ItemEdit from '@pages/admin/items/[id]/Page';

import Page0 from '@pages/admin/pages/page0/Page';
import Page1 from '@pages/admin/pages/page1/Page';
import Page2 from '@pages/admin/pages/page2/Page';
import Page3 from '@pages/admin/subMenuPages/subMenu/page3/Page';
import Page4 from '@pages/admin/subMenuPages/subMenu/page4/Page';
import Page5 from '@pages/admin/subMenuPages/subMenu/page5/Page';

export const routesMap: routesMapType[] = [
  // {
  //   path: '/',
  //   title: '',
  //   hide: true,
  //   redirect: 'admin/dashboard',
  // },
  {
    path: 'admin',
    title: 'admin',
    icon: <DashboardOutlined />,
    // element: <Dashboard />,
    // index: true,
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        index: true,
        icon: <AreaChartOutlined />,
        element: <Dashboard />,
      },
      {
        path: 'notices',
        title: 'Notices',
        hide: true,
        element: <Notices />,
      },
      {
        path: 'items',
        title: 'Items',
        icon: <TableOutlined />,
        element: <ItemTable />,
      },
      {
        path: 'items/:id',
        title: 'Item',
        hide: true,
        element: <ItemEdit />,
      },
      // {
      //   path: 'pages',
      //   title: 'Pages',
      //   icon: <ExperimentOutlined />,
      //   // element: <Navigate to='/pages/page0' />,
      //   // element: <Page0 />,
      //   children: [
      //     {
      //       // path: '/pages/page0',
      //       path: 'page0',
      //       title: 'Page0',
      //       element: <Page0 />,
      //     },
      //     {
      //       // path: ' /pages/page1',
      //       path: 'page1',
      //       title: '自定义错误',
      //       element: <Page1 />,
      //     },
      //     {
      //       // path: '/pages/page2',
      //       path: 'page2',
      //       title: 'Page2',
      //       element: <Page2 />,
      //     },
      //   ],
      // },
    ],
  },
];

export const routesMap2: routesMapType[] = [
  {
    path: 'admin',
    title: 'Admin',
    hide: true,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        index: true,
        icon: <AreaChartOutlined />,
        element: <Dashboard />,
      },
      {
        path: 'notices',
        title: 'Notices',
        hide: true,
        element: <Notices />,
      },
      {
        path: 'items',
        title: 'Items',
        icon: <TableOutlined />,
        element: <ItemTable />,
      },
      {
        path: 'items/:id',
        title: 'ItemsEdit',
        hide: true,
        element: <ItemEdit />,
      },
      {
        path: 'pages',
        title: 'Pages',
        icon: <ExperimentOutlined />,
        redirect: '/admin/pages/page0',
        children: [
          {
            // path: '/pages/page0',
            path: 'page0',
            title: 'Page0',
            icon: <UnorderedListOutlined />,
            element: <Page0 />,
          },
          {
            // path: ' /pages/page1',
            path: 'page1',
            title: '自定义错误',
            icon: <QuestionCircleOutlined />,
            element: <Page1 />,
          },
          {
            // path: '/pages/page2',
            path: 'page2',
            title: 'Page2',
            icon: <UnorderedListOutlined />,
            element: <Page2 />,
          },
        ],
      },
      {
        path: 'subMenuPages',
        title: 'SubMenuPages',
        icon: <ExperimentOutlined />,
        redirect: '/admin/subMenuPages/subMenu',
        children: [
          {
            path: 'subMenu',
            title: 'SubMenu',
            icon: <ExperimentOutlined />,
            redirect: '/admin/subMenuPages/subMenu/page3',
            children: [
              {
                // path: '/pages/page0',
                path: 'page3',
                title: 'Page3',
                icon: <UnorderedListOutlined />,
                element: <Page3 />,
              },
              {
                // path: ' /pages/page1',
                path: 'page4',
                title: 'Page4',
                icon: <UnorderedListOutlined />,
                element: <Page4 />,
              },
              {
                // path: '/pages/page2',
                path: 'page5',
                title: 'Page5',
                icon: <UnorderedListOutlined />,
                element: <Page5 />,
              },
            ],
          },
        ],
      },
    ],
  },
];
