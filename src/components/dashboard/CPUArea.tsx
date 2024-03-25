import React, { useMemo, useImperativeHandle } from 'react';
import { Button, Result } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Area, type AreaConfig, Plot } from '@ant-design/plots';
import type { GetProp, GetProps, GetRef } from 'antd';

import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import logger from '@utils/logger';

interface Props {
  isError: boolean;
}
type CPURef = React.Ref<any>;

function CPUArea(props: Props, ref: CPURef) {
  // const { cpuUse } = useAppSelector(state => {
  //   return state.serverLoad;
  // });
  // const graphRef = useRef<any>(null);

  const { isError } = props;

  const config = useMemo((): AreaConfig => {
    return {
      data: [],
      // data: cpuUse,
      // height: 300,
      xField: 'time',
      yField: 'use',
      seriesField: 'type',
      yAxis: {
        label: {
          formatter: function formatter(v) {
            return v + '%';
          },
        },
      },
      // colorField: 'use',
      // color: ({ type }) => {
      //   if (type === 'CPU') {
      //     return '#1890FF';
      //   }
      //   return 'red';
      // },
      // annotations: [
      //   {
      //     type: 'regionFilter',
      //     start: ['min', '0'],
      //     end: ['max', '20'],
      //     color: '#F4664A',
      //   },
      // ],
      // point: {
      //   size: 2,
      //   shape: 'diamond',
      // },
      smooth: false,
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
          animation: 'zoom-in',
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
      meta: {
        use: {
          min: 0,
          max: 100,
          tickCount: 10,
        },
        time: {
          tickCount: 10,
        },
      },
      // showCrosshairs: true,
    };
  }, []);

  // useImperativeHandle(
  //   ref,
  //   () => {
  //     logger.trace('useImperativeHandle', graphRef.current);
  //     return {
  //       ref: graphRef.current?.getChart(),
  //     };
  //   },
  //   [graphRef.current]
  // );

  logger.trace('CPUArea render');

  // logger.trace(cpuUse);

  // useEffect(() => {
  //   // ref?.current?.getChart().changeData(cpuUse);
  //   ref?.current?.getChart().update({ ...config, data: cpuUse });
  //   logger.info(ref?.current?.getChart());
  // }, [cpuUse, config]);

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
      <Area
        {...config}
        // ref={graphRef}
        ref={ref}
      />
    </>
  );
}

export default React.memo(React.forwardRef(CPUArea));
