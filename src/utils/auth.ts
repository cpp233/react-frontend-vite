import logger from '@utils/logger';
import MyStorage from '@utils/MyStorage';

const userStorage = new MyStorage<LoginSuccess>('user');
export const getUser = (): LoginSuccess | null => {
  // const user = sessionStorage.getItem('user') || localStorage.getItem('user');
  // return user ? JSON.parse(user) : {};
  return userStorage.getItem();
};

export const setUser = (userPar: LoginSuccess, remember = false) => {
  // const user = JSON.stringify(userPar);
  // if (remember) {
  //   localStorage.setItem('user', user);
  // } else {
  //   sessionStorage.setItem('user', user);
  // }
  const { expires, ..._other } = userPar;
  // logger.trace(expires, other, remember);
  userStorage.setItem(userPar, expires ? expires : 5000, remember);
};

export const isLogin = (): boolean => {
  // const isLogin1 =
  //   sessionStorage.getItem('user') || localStorage.getItem('user');
  // // logger.info(isLogin1);
  // return isLogin1;

  if (userStorage.getItem() !== null) {
    return true;
  }
  return false;
};

export const clearUser = () => {
  // sessionStorage.removeItem('user');
  // localStorage.removeItem('user');
  userStorage.removeItem();
};
