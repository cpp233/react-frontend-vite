import React, { lazy } from 'react';
import logger from '@utils/logger';

const routeConfigFileList = import.meta.glob('../pages/**/routeConfig.tsx', {
  eager: true,
  import: 'default',
});
const modules = import.meta.glob('../pages/**/Page.tsx');

export const handleFile = () => {
  // logger.trace(routeConfigFileList);

  // 生成文件数组
  const resultArr: autoRoutesType[] = [];
  for (const [path, meta] of Object.entries(routeConfigFileList)) {
    // logger.trace(path, meta);
    const elementPath = path.replace('routeConfig.tsx', 'Page.tsx');
    let newPath =
      path.replace('../pages/', '').replace('/routeConfig.tsx', '') || '/';
    // const element = await comps[elementPath]();
    // const element = modules[elementPath] as () => Promise<{
    //   default: React.ComponentType<any>;
    // }>;
    const element = modules[elementPath];
    // logger.trace({
    //   pageFileList,
    //   path,
    //   newPath,
    //   elementPath,
    //   meta,
    //   element: lazy(element),
    // });

    // 是否动态参数
    const dynamicPar = /\[(?<parameter>\w+)\]/.exec(newPath)?.groups?.parameter;
    if (dynamicPar) {
      newPath = newPath.replace(/\[\w+\]/, `:${dynamicPar}`);
    }

    resultArr.push({
      path: newPath,
      // title: 'admin',
      // element: lazy(element),
      element: element,
      ...(meta as RouteConfig),
    });
  }

  // 生成文件树
  const resultTree: autoRoutesType = {
    path: 'placeholder',
    title: '',
    children: [],
  };
  const makeTree = (route: autoRoutesType, tree: autoRoutesType) => {
    const pathArr = route.path.split('/');

    // 合并 /:xxx 的路径，拼接到上一级路径
    const index = pathArr.findIndex(item => /^:\w+$/.test(item));
    if (index !== -1) {
      const oldString = pathArr[index];
      pathArr.splice(index, 1);
      pathArr[index - 1] = `${pathArr[index - 1]}/${oldString}`;
    }

    pathArr.reduce((pre, cur, index, pathArr) => {
      const isLast = index === pathArr.length - 1;

      const object: autoRoutesType = {
        ...route,
        path: cur,
        // children: !isLast && [],
        // title: isLast && route.title,
        // icon: isLast && route.icon,
        // redirect: isLast && route.redirect,
        // hide: isLast && route.hide,
        // element: isLast && route.element,
      };

      if (!Array.isArray(pre.children)) {
        pre.children = [];
      }

      const isFind = pre.children.find(item => item.path === cur);
      if (!isFind) {
        pre.children.push(object);
        return object;
      }

      if (isLast) {
        isFind.title = route.title;
        isFind.icon = route.icon;
        isFind.redirect = route.redirect;
        isFind.hide = route.hide;
        isFind.element = route.element;
      }

      return isFind;
    }, tree);
  };

  for (const route of resultArr) {
    makeTree(route, resultTree);
  }

  return { resultArr, resultTree: resultTree.children };
};
// logger.trace('only once');

export const autoRouters = handleFile();
