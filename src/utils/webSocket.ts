import { message } from 'antd';
// import { getUser, clearUser } from '@utils/auth';
import logger from './logger';

class Socket {
  #socket: WebSocket | null;
  #protocol: string;
  #hostAndPath: string;
  #token: string;
  #eventList: { eventName: string; callback: any }[] = [];
  #MAX_RETRY_COUNT = 10;
  #retryCount = 0;
  constructor() {
    this.#socket = null;
    this.#protocol = '';
    this.#hostAndPath = '';
    this.#token = '';
  }
  connect(path: string, token: string) {
    if (!this.#socket) {
      // this.#socket = new WebSocket(path, token);

      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const hostAndPath = location.host + path;

      // logger.trace('connect', { protocol, hostAndPath, token });
      this.#socket = new WebSocket(`${protocol}://${hostAndPath}`, token);
      // if (/4\d\d/.exec(error.response?.status)) {
      //   message.error('认证失败，请重新登陆。');
      //   clearUser();

      this.#protocol = protocol;
      this.#hostAndPath = hostAndPath;
      this.#token = token;

      this.addFailRetry();
    }
  }
  disconnect() {
    if (this.#socket) {
      this.#socket.close();
      this.#socket = null;
    }
  }
  send(message: string | object) {
    if (!this.#socket) {
      return;
    }

    if (this.#socket.readyState !== WebSocket.OPEN) {
      return;
    }

    if (typeof message === 'string') {
      this.#socket.send(message);
      return;
    }
    this.#socket.send(JSON.stringify(message));
  }
  on<K extends keyof WebSocketEventMap>(
    eventName: K,
    // callback: (this: WebSocket, ev: WebSocketEventMap[K]) => any
    callback: (ev: WebSocketEventMap[K]) => any
  ) {
    if (this.#socket) {
      this.#socket.addEventListener(eventName, callback);
      this.#eventList.push({ eventName, callback });
    }
  }
  addFailRetry() {
    if (this.#socket) {
      // logger.trace('多次触发？');
      this.#socket.addEventListener('close', event => {
        // logger.trace('close', event, this.#retryCount);

        // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
        if (event.code === 1006 && this.#retryCount < this.#MAX_RETRY_COUNT) {
          // this.#socket?.close();
          // this.#socket = null;

          setTimeout(() => {
            this.#retryCount++;
            logger.trace(`正在尝试第 ${this.#retryCount} 次重连`);
            // logger.trace(this.#eventList);
            const protocol = this.#protocol;
            const hostAndPath = this.#hostAndPath;
            const token = this.#token;
            this.#socket = new WebSocket(`${protocol}://${hostAndPath}`, token);
            this.#socket.addEventListener('open', event => {
              this.#retryCount = 0;
              logger.trace('connect', event, this.#socket);
              for (const event of this.#eventList) {
                // logger.trace('添加事件', event.eventName, event.callback.toString());

                if (event.eventName === 'open') {
                  event.callback(event);
                }

                this.#socket?.addEventListener(event.eventName, event.callback);
              }
            });
            this.addFailRetry();
          }, 5000);
        }
      });
    }
  }
}

export { Socket };
