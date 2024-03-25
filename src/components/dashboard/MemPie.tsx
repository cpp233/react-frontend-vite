import React, { useImperativeHandle, useMemo } from 'react';
import { Button, Result } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Pie, type PieConfig } from '@ant-design/plots';
import type { GetProp, GetProps, GetRef } from 'antd';

import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import logger from '@utils/logger';

interface Props {
  isError: boolean;
}
type MemRef = React.Ref<any>;

const MemPie = (props: Props, ref: MemRef) => {
  // const memoryUse = useAppSelector(state => {
  //   const { memoryUse } = state.serverLoad;
  //   return Object.entries(memoryUse).map(([, value]) => value);
  // });

  const { isError } = props;

  const config = useMemo((): PieConfig => {
    return {
      data: [],
      // data: memoryUse,
      angleField: 'value',
      colorField: 'type',
      radius: 1,
      innerRadius: 0.64,
      // meta: {
      //   unit: {
      //     formatter: function formatter(v) {
      //       return ''.concat(v, ' \xA5');
      //     },
      //   },
      // },
      tooltip: {
        fields: ['unit'],
      },
      label: {
        type: 'inner',
        offset: '-50%',
        style: { textAlign: 'center' },
        autoRotate: false,
        content: function content(_ref) {
          return _ref.unit;
        },
      },
      interactions: [
        { type: 'tooltip', enable: false },
        // { type: 'element-selected' },
        // { type: 'element-active' },
        // { type: 'pie-statistic-active' },
      ],
      statistic: {
        title: false,
        content: {
          style: {
            fontFamily: '微软雅黑',
            // fontWeight: 'normal',
            // fontSize: '20px',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          customHtml: (container, view, datum, data) => {
            if (data?.length && data?.length > 1) {
              const use = data[0].value;
              const free = data[1].value;
              return `已使用\n${((use / (use + free)) * 100).toFixed()} %`;
            }
            return '';
          },
        },
      },

      chartRef: chartRef => {
        // logger.info('MemPie:setRef', chartRef);
      },
      animation: {
        // 图表第一次加载时的入场动画
        appear: {
          animation: 'zoom-in',
          duration: 100,
          // easing:'',
          delay: 100,
        },
        // 图表绘制完成，发生更新后，产生的新图形的进场动画
        enter: {
          animation: 'path-in',
          duration: 100,
          // easing:'',
          delay: 100,
        },
        // 图表绘制完成，数据发生变更后，有状态变更的图形的更新动画
        update: {
          animation: 'position-update',
          duration: 500,
          // easing:'',
          delay: 500,
        },
        // 图表绘制完成，数据发生变更后，被销毁图形的销毁动画
        leave: {
          animation: 'zoom-out',
          duration: 100,
          // easing:'',
          delay: 100,
        },
      },
    };
  }, []);

  logger.trace('MemPie render');

  return (
    <>
      {isError && (
        <Result
          className='websocket-retry-fail'
          status='error'
          title='Websocket 断开'
          subTitle='请重新载入'
          extra={
            [
              // <Button type='primary' key='console'>
              //   Go Console
              // </Button>,
            ]
          }
        ></Result>
      )}
      <Pie
        {...config}
        // ref={graphRef}
        ref={ref}
      />
    </>
  );
};

export default React.memo(React.forwardRef(MemPie));
