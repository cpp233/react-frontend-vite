// 废弃
import WS from '@utils/ws';
import { getUser } from '@utils/auth';
import { message } from 'antd';

const HARDWAREMONITOR_API_V1 = 'ws://localhost:3001/hardwareMonitor';
// const HARDWAREMONITOR_API_V1 = 'ws://localhost/hardwareMonitor';

export const getHardwareMonitor = async () => {
  const ws = new WS();
  const token = getUser()?.token;
  if (!token) {
    message.warning('token 无效');
    return;
  }
  await ws.join(HARDWAREMONITOR_API_V1, token);
  return ws;
};
