// 初始化用 sessionStorage|localStorage
// 用之前，清空两者的 key，保证同 key 只有一个登录状态

import logger from './logger';

// 实现一个 Storage 类，具有

//  - setItem
//  - getItem
//  - removeItem

// 函数。类构造函数接收一个字符串作为参数,并作为存储的 key。value 用上面的函数修改。

// 同时具有过期的功能。

// setItem 有个参数 expires 能够提供设置过期时间的功能。
// setItem 有个参数 remver 能够提供 sessionStorage 和 localStorage 的切换

class MyStorage<T> {
  #key: string;
  #storage: Storage;
  constructor(key: string) {
    if (typeof key !== 'string' && key !== '') {
      throw new Error('key 必须是非空字符串');
    }
    this.#key = key;
    this.#storage = localStorage;
  }

  #clear() {
    localStorage.removeItem(this.#key);
    sessionStorage.removeItem(this.#key);
  }

  setItem(value: T, ttl: number, remover = true) {
    // const item: { value: any; expires: Date } = { value };
    const now = new Date();
    let expires: number = now.getTime();

    if (ttl) {
      expires = expires + ttl;
    }

    if (!remover) {
      this.#storage = sessionStorage;
    }

    // 初始化 key ，确保每个 key 只有一个状态
    this.#clear();

    this.#storage.setItem(this.#key, JSON.stringify({ value, expires }));
  }

  getItem(): T | null {
    const itemContent = this.#storage.getItem(this.#key);

    if (!itemContent) {
      return null;
    }

    const item = JSON.parse(itemContent);

    if (!item) {
      return null;
    }

    if (item.expires && new Date(item.expires) <= new Date()) {
      return null;
    }

    return item.value;
  }

  removeItem() {
    this.#storage.removeItem(this.#key);
  }
}

// 测试
const test = () => {
  logger.trace('MyStorage test');
  // new MyStorage();
  // new MyStorage('');
  const myStorage = new MyStorage('test');
  // myStorage.setItem({ type: 'remember' }, 1000 * 5, true);
  myStorage.setItem({ type: 'not remember' }, 1000 * 5, false);
  // myStorage.removeItem();
  let value = myStorage.getItem();
  logger.trace(value);
  setTimeout(() => {
    value = myStorage.getItem();
    logger.trace('3000ms:', value);
  }, 3000);
  setTimeout(() => {
    value = myStorage.getItem();
    logger.trace('5000ms:', value);
  }, 6000);
};

// test();

export default MyStorage;
