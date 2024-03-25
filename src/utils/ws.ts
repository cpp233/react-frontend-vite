// 废弃
import logger from '@utils/logger';

class WS {
  #ws: WebSocket | null;
  #pollingFn: Function | null;
  #isPolling = false;
  constructor() {
    this.#ws = null;
    this.#pollingFn = null;
  }
  join(url: string, token: string) {
    return new Promise<void>((resolve, reject) => {
      this.#ws = new WebSocket(url, token);

      this.#ws.addEventListener('message', event => {
        try {
          const jsonObj = JSON.parse(event.data);
          // logger.info('jsonObj:', jsonObj, this.#isPolling, this.#pollingFn);
          this.#isPolling && this.#pollingFn && this.#pollingFn(jsonObj);
        } catch (error) {
          logger.error('error:', error);
        }
      });

      switch (this.#ws.readyState) {
        case WebSocket.CONNECTING:
          // logger.info('connecting');
          break;
        case WebSocket.OPEN:
          break;
        case WebSocket.CLOSING:
          // logger.info('CLOSING');
          break;
        case WebSocket.CLOSED:
          // logger.info('CLOSED');
          break;
        default:
          // this never happens
          break;
      }

      this.#ws.onopen = () => {
        logger.info('ws client open');
        resolve();
      };
      this.#ws.onerror = event => {
        logger.info('error:', event);
        reject();
      };
    });
  }
  addPollingFn(fn: Function) {
    this.#pollingFn = fn;
  }
  joinPolling() {
    this.#isPolling = true;
    this.#ws?.send('{"type":"joinPooling"}');
  }
  send(data: any) {
    this.#ws?.send(data);
  }
  close() {
    this.#ws?.send('{"type":"leavePooling"}');
    this.#ws?.close();

    this.#ws = null;
    this.#pollingFn = null;
    this.#isPolling = false;
  }
}

export default WS;
