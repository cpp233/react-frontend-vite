import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { AreaConfig, PieConfig, Plot } from '@ant-design/plots';

import CPUArea from '@components/dashboard/CPUArea';
import MemPie from '@components/dashboard/MemPie';
import CacheWordCloud from '@components/dashboard/CacheWordCloud';
// import MemLiquid from '@components/dashboard/MemLiquid';
import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import {
  wsConnectAction,
  wsDisconnectAction,
} from '@redux/actions/serverLoadAction';
import logger from '@utils/logger';

import './Dashboard.css';

const Dashboard = () => {
  // const [cpuRef, setCpuRef] = useState<React.MutableRefObject>(null);
  const cpuRef = useRef<any>(null);
  const memRef = useRef<any>(null);

  const dispatch = useAppDispatch();
  const serverLoad = useAppSelector(state => {
    return state.serverLoad;
  });

  useEffect(() => {
    // let cpuUseQueue = [];
    // let ws: WS | null = null;
    // const fetchData = async () => {
    //   ws = await getHardwareMonitor();
    //   ws.addPollingFn(updateChart({ cpuUseQueue }));
    //   ws.joinPolling();
    // };
    // fetchData();
    // return () => {
    //   logger.info('Dashboard.unmount:');
    //   ws.close();
    // };
    // dispatch(initWs());
    dispatch(wsConnectAction());
    // dispatch({ type: 'socket/join' });

    return () => {
      dispatch(wsDisconnectAction());
    };
  }, []);

  useEffect(() => {
    const { cpuUse, memoryUse, loading } = serverLoad;

    if (loading) {
      return;
    }

    const cpuChart: Plot<AreaConfig> = cpuRef?.current?.getChart();
    const memChart: Plot<PieConfig> = memRef?.current?.getChart();

    // logger.trace('Dashboard get sub Component data done:', {
    //   memChart,
    //   cpuChart,
    // });

    cpuChart && cpuChart?.changeData(cpuUse);
    memChart &&
      memChart?.changeData(Object.entries(memoryUse).map(([, value]) => value));
  }, [serverLoad]);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Card title='CPU 使用率'>
            <CPUArea ref={cpuRef} isError={serverLoad.isError}></CPUArea>
          </Card>
        </Col>
        <Col span={12}>
          <Card title='内存用量'>
            <MemPie ref={memRef} isError={serverLoad.isError}></MemPie>
            {/* <MemLiquid></MemLiquid> */}
          </Card>
        </Col>
      </Row>
      <Row gutter={6} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title='缓存词云'>
            <CacheWordCloud></CacheWordCloud>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
