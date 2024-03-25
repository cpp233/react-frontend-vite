import type { Plugin } from 'vite';
import pluginExternalGlobals from 'rollup-plugin-external-globals';
import { parse } from 'node-html-parser';

import packageJson from '../package.json';

interface Dependencies {
  [key: string]: string;
}

interface Option {
  name: string;
  module: string;
  path: string;
  version?: string;
  urlTemplate?: string;
  props?: string[];
}
interface AcornNode {
  end: number;
  start: number;
  type: string;
}

const getDepVersionMap = () => {
  const dependencies: Dependencies = packageJson.dependencies || {};

  const dependencyVersions = new Map();

  for (const [dependency, version] of Object.entries(dependencies)) {
    // 使用正则表达式去除版本号中的非数字和 . 字符
    const formattedVersion = version.replace(/[^0-9.]/g, '');
    dependencyVersions.set(dependency, formattedVersion);
  }

  return dependencyVersions;
};

// 支持基于不同 Domain 的 CDN
export default function myPlugin(options: Option[]): Plugin {
  // 从 option 中提取出所有包名。 external
  const externalList: string[] = [];
  for (const iterator of options) {
    externalList.push(iterator.name);
  }
  const globals = {};
  for (const iterator of options) {
    globals[iterator.name] = iterator.module;
  }

  // let config = null;
  const versionMap = getDepVersionMap();
  // console.log(externalList, globals, versionMap);

  // 样式模板，默认为 cloudflare
  const defaultUrlList = [
    'https://cdnjs.cloudflare.com/ajax/libs/{name}/{version}/{path}',
    // 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
    // 'https://unpkg.com/{name}@{version}/{path}',
  ];

  // 用来生成 CDN tag
  const scriptList = options.map(option => {
    const { name, path, urlTemplate, props } = option;
    // 获取 defaultUrl 中随机一条
    const index = Math.floor(Math.random() * defaultUrlList.length);
    const url = urlTemplate || defaultUrlList[index];

    const newUrl = url
      .replace('{name}', name)
      .replace('{version}', versionMap.get(name))
      .replace('{path}', path);

    return {
      name: name,
      url: newUrl,
      props,
    };
  });

  // console.log(scriptList);

  return {
    name: 'CDN-replace',
    apply: 'build',
    config(viteConfig, { command }) {
      // console.log({ config2 });
      if (command === 'build') {
        // 已经通过 CDN 引入包，所以自动剔除多余打包文件
        viteConfig.build.rollupOptions = {
          ...viteConfig.build.rollupOptions,
          external: externalList,
          plugins: [pluginExternalGlobals(globals)],
        };
      }

      // console.log(viteConfig.build.rollupOptions);
      return viteConfig;
    },
    // resolveId(id) {
    //   // if (options.external.includes(id)) {
    //   //   return { id, external: true };
    //   // }
    //   console.log(id);
    //   return { id, external: true };
    // },

    // transform(src, id) {
    //   const excludes = [/node_modules\//];
    //   if (excludes.some(item => item.test(id))) {
    //     return;
    //   }
    //   const includes = [/\.tsx?/];
    //   if (!includes.some(item => item.test(id))) {
    //     return;
    //   }
    //   // console.log(id);
    //   // return {
    //   //   code: compileFileToJS(src),
    //   //   map: null, // 如果可行将提供 source map
    //   // };

    //   // console.log(src);
    //   // console.log(id);
    //   return undefined;
    // },

    transformIndexHtml(html) {
      // console.log(html);

      // const match = html.matchAll(/<script src=["']\w+["'].*>.*<.*\/script>/gi);
      const root = parse(html);
      const domList = root.querySelectorAll('script');
      let appendScript = '';
      for (const item of domList) {
        // console.log(item.rawAttrs);
        // console.log(item.getAttribute('src'));
        // console.log(item);
        appendScript += `
        var script = document.createElement('script');
        script.src = '${item.getAttribute('src')}'
        script.type = 'module'
        document.head.appendChild(script);
        `;
      }

      // 辅助判断所有 script 标签加载完毕
      const helperScript = `    <script>
      var __cdnLoad = function () {
        var list = [${scriptList.map(item => `"${item.name}"`)?.join(',')}];
        return function (par) {
          list = list.filter(function (item) {
            return item !== par;
          });
          if(list.length < 1){
            console.log('CND 文件 加载完毕');
          }
        };
      }();
      </script>`;
      // ${appendScript}

      // 转换为 cdn 标签模板
      const template = scriptList
        .map(item => {
          const propsStr = item.props?.join(' ');
          const onLoad = `onload="__cdnLoad('${item.name}')"`;
          const template = `    <script src="${item.url}" ${propsStr} ${onLoad}></script>`;
          return template;
        })
        ?.join('\n');

      // console.log(template);
      return html.replace('<head>\n', `<head>\n${helperScript}\n${template}\n`);
      // return html;
    },
    buildEnd() {
      console.log('CDN-replace buildEnd.\n');
    },
  };
}
