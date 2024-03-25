// 注；此方法 hook 影响源
// const init = () => {
//   ['log', 'info', 'warn', 'error'].forEach(function (method) {
//     console[method] = console[method].bind(console, new Date().toISOString());
//   });

//   // console.log('cur time');
// };

enum Level {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

// 除非要输出到其他地方，或者自己操作上下文。
// 否则，多一层包裹，会多一层上下文。 debug 麻烦。
class Logger {
  private static pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  private static getTimeString(): string {
    const now = new Date();
    const hour = Logger.pad(now.getHours());
    const minute = Logger.pad(now.getMinutes());
    const second = Logger.pad(now.getSeconds());
    const millisecond = Logger.pad(now.getMilliseconds());
    return `${hour}:${minute}:${second}.${millisecond}`;
  }

  private static isTime(): boolean {
    return true;
  }

  private static format(...args: unknown[]): unknown[] {
    const result = [];

    if (Logger.isTime()) {
      const timeString = Logger.getTimeString();
      result.push(`%c%s`);
      result.push('color: #5f6368; font-size: 12px');
      result.push(`${timeString}`);
    }

    return [...result, ...args];
  }

  public log(...args: unknown[]): void {
    const format = Logger.format();
    console.log(...format);
  }

  public trace(...args: unknown[]): void {
    const config = {
      isGroup: true,
    };
    const format = Logger.format(args);

    config.isGroup && console.groupCollapsed(...format);

    const targetObject: any = {};
    Error.captureStackTrace(targetObject);
    console.log(targetObject.stack);

    config.isGroup && console.groupEnd();
  }
}

// const logger = new Logger();
const logger = console;

const getLogTime = () => {
  const result = [];

  result.push('%c%s');
  result.push('color: #5f6368; font-size: 12px');

  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  const millisecond = now.getMilliseconds().toString().padStart(3, '0');

  result.push(`${hour}:${minute}:${second}.${millisecond}`);

  return result;
};

const info = (...params: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    logger.log(...getLogTime(), ...params);
  }
};

const error = (...params: unknown[]) => {
  // if (process.env.NODE_ENV === 'development') {
  console.error(...params);
  // }
};

const trace = (...params: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    // console.trace(params);

    // logger.trace(...params);
    // return;

    const config = {
      isGroup: true,
    };

    config.isGroup &&
      // console.groupCollapsed(...params);
      console.groupCollapsed(...getLogTime(), ...params);
    const targetObject: any = {};
    Error.captureStackTrace(targetObject);
    console.log(targetObject.stack);
    // console.log(new Error().stack);
    config.isGroup && console.groupEnd();

    // g __LINE__
    // const getLine = (offset)=> {
    //   var stack = new Error().stack.split('\n'),
    //     line = stack[(offset || 1) + 1].split(':');
    //   return parseInt(line[line.length - 2], 10);
    // }

    // Object.defineProperty(window, '__LINE__', {
    //   get: function () {
    //     return getLine(2);
    //   },
    // });

    // var orig = console.log;
    // console.log = function (input) {
    //   var isChrome = navigator.userAgent.indexOf('Chrome') !== -1;
    //   if (isChrome) {
    //     var stack = new Error().stack;
    //     var file = stack.split('\n')[2].split('/')[4].split('?')[0];
    //     var line = stack.split('\n')[2].split(':')[5];
    //     var append = file + ':' + line;
    //   }
    //   orig.apply(console, [input, append]);
    // };
    // console.log(params);
  }
};

export default {
  info,
  error,
  trace,
  // _log,
};
