import { message } from 'antd';
import { getUser, clearUser } from '@utils/auth';
import logger from '@utils/logger';
import {
  updateServerLoadAction,
  toggleStateAction,
} from '@redux/actions/serverLoadAction';
import { Socket } from '@utils/webSocket';

// 封装 socket 到 reducer
export const socketMiddleware =
  (socket: Socket) => (params: any) => (next: any) => (action: any) => {
    const { dispatch, getState } = params;
    const { type } = action;

    const token = getUser()?.token;

    switch (type) {
      case 'WS_CONNECT':
        // socket.connect('ws://localhost:3001/hardwareMonitor', getUser().token);

        if (!token) {
          message.error('认证失败，请重新登陆。');
          clearUser();
          window.location.href = '/login';
          break;
        }

        socket.connect('/hardwareMonitor', token);

        socket.on('open', (event: Event) => {
          // logger.trace('socketMiddleware openEvent:', event);
          // socket.send('{"type":"joinPooling"}');
          const json = { type: 'joinPooling' };
          socket.send(json);
          dispatch(toggleStateAction(false));
        });
        socket.on('message', (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'error':
              logger.trace('error:', data);
              socket.disconnect();
              message.error('认证失败，请重新登陆。');
              clearUser();
              window.location.href = '/login';
              break;
            case 'success':
              // logger.info('messageEvent:', data);
              // logger.info('messageEvent:', getState());
              dispatch(updateServerLoadAction(JSON.parse(data.message)));
              break;
            case 'debug':
              logger.trace('socketMiddleware debug:', data);
              break;
            default:
              logger.trace('socketMiddleware Unknown:', data);
              break;
          }
        });
        socket.on('close', (event: CloseEvent) => {
          // dispatch(toggleStateAction(true));
          logger.trace('socketMiddleware closeEvent:', event);
        });
        socket.on('error', (event: Event) => {
          dispatch(toggleStateAction(true));
          logger.error('socketMiddleware errorEvent:', event);
        });
        break;

      case 'WS_DISCONNECT':
        socket.send('{"type":"leavePooling"}');
        socket.disconnect();
        break;

      // case 'SOCKET_JOIN':
      //   socket.send('{"type":"joinPooling"}');
      default:
        break;
    }

    return next(action);
  };
