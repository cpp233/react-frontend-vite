import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './index.css';

import { ConfigProvider as AntdConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

import store from '@redux/store';
import { reactRouter } from '@routers/routers';
// import 'babel-polyfill';
import logger from '@utils/logger';

// const router = createBrowserRouter(reactRouter);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ReduxProvider store={store}>
    <AntdConfigProvider locale={zhCN}>
      <RouterProvider
        router={reactRouter}
        fallbackElement={<p>Performing initial data &quot;load&quot;</p>}
      />
    </AntdConfigProvider>
  </ReduxProvider>
);
