// import CryptoJS from 'crypto-js';
import logger from './logger';

const isSecureOrigin = () => {
  // (https, *, *)
  // (wss, *, *)
  // (*, localhost, *)
  // (*, 127/8, *)
  // (*, ::1/128, *)
  // (file, *, —)
  // (chrome-extension, *, —)

  const protocol = window.location.protocol;
  const host = window.location.host;

  if (protocol === 'https:' || protocol === 'wss:') {
    return true;
  }

  if (
    protocol === 'file:' ||
    protocol === 'chrome-extension:' ||
    /^localhost/.test(host) ||
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^::1$/.test(host)
  ) {
    return true;
  }

  return false;
};

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
};

export const stringToColor = (str: string) => {
  const hash = hashCode(str);
  return '#' + intToRGB(hash);
};

const getHash = async (str: string) => {
  // 计算 SHA-256 哈希值
  // const hashHex = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);

  // 注：需要在 https 下使用
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string

  // logger.trace({ hash, hashHex });
  return hashHex;
};

export const strToNumber = async (
  str: string,
  min = 0,
  max = 10
): Promise<number> => {
  if (!isSecureOrigin()) {
    console.warn(
      `The current origin (${window.location.origin}) is not allowed to access crypto.subtle.digest.`
    );
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const hash = await getHash(str);

  // 将哈希值转换为数字
  const num = parseInt(hash.substring(0, 8), 16);
  // 映射到 [min, max] 范围内
  return min + (num % (max - min + 1));
};

export const getColor = async (str: string) => {
  const colorList = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];

  const index = await strToNumber(str, 0, colorList.length - 1);

  return colorList[index];
};

// 数值：返回[object Number]
// 字符串：返回[object String]
// 布尔值：返回[object Boolean]
// undefined：返回[object Undefined]
// null：返回[object Null]
// 数组：返回[object Array]
// arguments 对象：返回[object Arguments]
// 函数：返回[object Function]
// Error 对象：返回[object Error]
// Date 对象：返回[object Date]
// RegExp 对象：返回[object RegExp]
// 其他对象：返回[object Object]
// https://jsdoc.app/
/**
 * @description 比 typeof 更精准获取 js 的类型
 * @param { string } unknownType - string parameter
 * @returns { string } 返回值
 * - number
 * - string
 * - boolean
 * - undefined
 * - null
 * - array
 * - arguments
 * - function
 * - error
 * - date
 * - regexp
 * - object
 */
export const getType = (unknownType: unknown) => {
  const str = Object.prototype.toString.call(unknownType);
  const group = str.match(/\[object (?<type>.*?)\]/)?.groups;
  if (!group) {
    throw new Error('匹配出错');
  }

  return group.type.toLowerCase();
};

export const getEnv = () => {
  const env = import.meta.env;
  return env;
};
