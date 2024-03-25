import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
// import type { Route } from 'react-router-dom';

import { ProtectedRoute } from '@routers/ProtectedRoute';
import { routesMap, routesMap2 } from '@routers/routesMap';
import { autoRouters } from '@routers/autoRouters';

import LayoutPage from '@pages/Layout';
import NotMatch from '@pages/NotMatch';
import ErrorPage from '@pages/ErrorPage';
// import Login from '@pages/login/Page';
const Login = lazy(() => import('@pages/login/Page'));
// import Register from '@pages/register/Page';
const Register = lazy(() => import('@pages/register/Page'));

import Loading from '@components/Loading';

import logger from '@utils/logger';

// 普通路由生成
const routeViews = (routesMap: routesMapType[]) => {
  if (!routesMap) {
    return [];
  }

  return routesMap.map(({ path, redirect, element, children, index }) => {
    // if (path === '/') {
    //   return;
    // }

    // logger.info({ path, redirect, index });
    if (children && children.length) {
      return (
        <Route
          key={path}
          path={path}
          // element={<Loading></Loading>}
        >
          {routeViews(children)}
          {redirect ? (
            <Route
              key={path + 'redirect'}
              path={path}
              element={<Navigate to={redirect} replace={true} />}
            ></Route>
          ) : (
            <Route
              key={'/' + path}
              path={'/' + path}
              element={<Navigate to={children[0].path} replace={true} />}
            ></Route>
          )}
        </Route>
      );
    }
    return (
      <Route key={path + 'warp'}>
        {/* <Route key={path} path={path} element={element}></Route> */}
        {/* {index && (
          <Route key={path + 'index'} index={index} element={element}></Route>
        )} */}
        {redirect ? (
          <Route
            key={path + 'redirect'}
            path={path}
            element={<Navigate to={redirect} replace={true} />}
          ></Route>
        ) : (
          <Route key={path} path={path} element={element}></Route>
        )}
      </Route>
    );
  });
};

// 普通路由生成
const makeRoutes = (routesMap: routesMapType[], parentPath?: string) => {
  return routesMap.map(route => {
    const curPath =
      parentPath === '/'
        ? parentPath + route.path
        : parentPath + '/' + route.path;
    // logger.trace(route.path, curPath);

    return route.redirect ? (
      <Route key={route.path + 'wrap'}>
        <Route
          key={route.path + 'redirects'}
          path={route.path}
          element={<Navigate to={route.redirect} replace={true} />}
        ></Route>
        <Route
          key={route.path}
          path={route.path}
          element={!route.children && route.element}
        >
          {route.children && makeRoutes(route.children, curPath)}
        </Route>
      </Route>
    ) : (
      <Route
        key={route.path}
        path={route.path}
        // index={route.index || false}
        element={!route.children && route.element}
      >
        {route.children && makeRoutes(route.children, curPath)}
      </Route>
    );
  });
};

// 自动路由生成
const makeAutoRoutes = (routesMap: autoRoutesType[]) => {
  return routesMap.map(route => {
    const MyElement = lazy(
      route?.element as () => Promise<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        default: React.ComponentType<any>;
      }>
    );
    // const element = React.createElement(route.element);
    // logger.trace(MyElement, route);
    return route.redirect ? (
      <Route
        // key={route.path + 'redirects'}
        key={route.path}
        path={route.path}
        element={<Navigate to={route.redirect} replace={true} />}
      ></Route>
    ) : (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Suspense fallback={<Loading></Loading>}>
            <MyElement></MyElement>
          </Suspense>
        }
        // Component={element}
      ></Route>
    );
  });
};

// logger.trace({
//   old: makeRoutes(routesMap2),
//   new: makeAutoRoutes(autoRouters.resultArr),
// });

export const reactRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route key='top'>
      <Route
        key='/login'
        path='/login'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Login></Login>
          </Suspense>
        }
      />
      <Route
        key='/register'
        path='/register'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Register></Register>
          </Suspense>
        }
      />
      <Route
        key='/'
        path='/'
        // errorElement={<ErrorPage />}
        element={
          <ProtectedRoute>
            <LayoutPage />
          </ProtectedRoute>
        }
      >
        {/* 在 outlet 内渲染 errorElement */}
        {/* https://github.com/remix-run/react-router/discussions/9553 */}
        {/* <Route errorElement={<ErrorPage />}>{routeViews(routesMap)}</Route> */}
        <Route errorElement={<ErrorPage />}>
          <Route
            key='/redirect'
            path='/'
            element={<Navigate to={'/admin'} replace={true} />}
          ></Route>
          {/* {makeRoutes(routesMap2, '/')} */}
          {makeAutoRoutes(autoRouters.resultArr)}
        </Route>
        {/* 404 */}
        <Route path='*' element={<NotMatch />} />
      </Route>
    </Route>
  )
);

// export const reactRouterOld = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path='/' element={<LayoutPage />} errorElement={<ErrorPage />}>
//       {/* https://github.com/remix-run/react-router/discussions/9553 */}
//       <Route
//         // path='/pages'
//         // element={<Navigate to={'/pages/page0'} />}
//         errorElement={<ErrorPage />}
//       >
//         {/* Home */}
//         {/* <Route index={true} element={<Page0 />} /> */}

//         {routesMap
//           .map(item => {
//             const { children, ...other } = item;

//             return (
//               <Route key={other.path} {...other}>
//                 {
//                   // const test = children?.map(childrenItem => {
//                   //   return <Route key={childrenItem.path} {...childrenItem} />;
//                   // });
//                   // logger.info({ test });
//                 }
//               </Route>
//             );
//           })
//           .map(item => {
//             // logger.info('routesMap:', item);
//             return item;
//           })}
//         {/* <Route path='/log-view' element={<LogPage />}></Route> */}
//         {/* <Route path='/*' element={<NotMatch />} /> */}
//         <Route path='*' element={<NotMatch />} />
//       </Route>
//     </Route>
//   )
// );
