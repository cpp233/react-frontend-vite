import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { WordCloud, type WordCloudConfig } from '@ant-design/plots';

import useObserver from '@hooks/useObserver';
import type { HookFnType } from '@hooks/useObserver';
import { getCacheList } from '@services/cacheService';
import logger from '@utils/logger';
import { Empty, message } from 'antd';

interface CacheWordCloudData {
  path: string;
  query: unknown;
  body: unknown;
  hit: number;
  sizeChangeCount: number;
}

function CacheWordCloud() {
  const [sizeChangeCount, setSizeChangeCount] = useState(0);
  const [cacheList, setCacheList] = useState<CacheWordCloudData[]>([]);

  const ref = useRef(null);

  useEffect(() => {
    // setTimeout(() => {
    // 要执行的函数
    getCacheList()
      .then(res => {
        // setCacheList(res.data);
        const newC = res.data.map(item => {
          return {
            path: item.key.path,
            query: item.key.requestQuery,
            body: item.key.requestBody,
            hit: item.value.hitCount,
            sizeChangeCount: sizeChangeCount,
          };
        });
        setCacheList(newC);
      })
      .catch(error => {
        message.error('获取出错');
        console.error(error);
      });
    // }, 10);
    logger.trace('change');
  }, []);

  useEffect(() => {
    const newList = cacheList.map(cache => {
      return {
        ...cache,
        sizeChangeCount: sizeChangeCount,
      };
    });

    setCacheList(newList);
  }, [sizeChangeCount]);

  const mutationFn: HookFnType = useCallback(
    (mutationRecord, _observer, count, setCount) => {
      mutationRecord.map(item => {
        if (item.attributeName === 'width' || item.attributeName === 'height') {
          logger.trace(item.attributeName);
          // const newCount = sizeChangeCount + 1;
          // setSizeChangeCount(newCount);
          const newCount = count + 1;
          setCount(newCount);
        }
      });
    },
    [sizeChangeCount]
  );
  // const mutationFn: HookFnType = (
  //   mutationRecord,
  //   observer,
  //   count,
  //   setCount
  // ) => {
  //   mutationRecord.map(item => {
  //     if (item.attributeName === 'width' || item.attributeName === 'height') {
  //       logger.trace(item.attributeName, sizeChangeCount, count);
  //       // const newCount = sizeChangeCount + 1;
  //       // setSizeChangeCount(newCount);

  //       const newCount = count + 1;
  //       setCount(newCount);

  //       // setCount({ ...count });
  //     }
  //   });
  // };

  const options = useMemo(() => {
    return {
      // attributeFilter: ['width', 'height'],
      // attributeOldValue:false,
      attributes: true,
      // characterData:false,
      characterDataOldValue: false,
      childList: true,
      subtree: true,
    };
  }, []);
  useObserver(ref.current, mutationFn, options, [
    sizeChangeCount,
    setSizeChangeCount,
  ]);

  const config: WordCloudConfig = useMemo(() => {
    return {
      data: cacheList,
      wordField: 'path',
      weightField: 'hit',
      colorField: 'path',
      wordStyle: {
        fontFamily: 'Verdana',
        fontSize: [16, 64],
        rotation: 0,
      },

      // 返回值设置成一个 [0, 1) 区间内的值，
      // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
      // random: () => {
      //   return Math.ceil(Math.random() * 10);
      // },
      // tooltip: {
      //   // fields: ['x', 'y'],
      //   customContent: (title, data) => {
      //     logger.trace({ title, data });
      //     return `<div class='g2-tooltip'>${title}</div>`;
      //   },
      // },
    };
  }, [cacheList]);

  logger.trace(
    'CacheWordCloud render:',
    cacheList,
    ref,
    sizeChangeCount,
    config
  );

  return (
    <div ref={ref} style={{ height: '100%' }}>
      {/* {cacheList.length <= 0 && <Empty></Empty>} */}
      {<WordCloud {...config} />}
    </div>
  );
}

export default React.memo(CacheWordCloud);
// export default CacheWordCloud;
