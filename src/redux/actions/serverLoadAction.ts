import { AppDispatch } from '@redux/store';
import { update, toggleState } from '@redux/features/serverLoadSlice';

export const wsConnectAction = () => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: 'WS_CONNECT' });
  };
};

export const wsDisconnectAction = () => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: 'WS_DISCONNECT' });
  };
};

export const updateServerLoadAction = (params: SystemInfo) => {
  return async (dispatch: AppDispatch) => {
    dispatch(update({ ...params }));
  };
};

export const toggleStateAction = (params: boolean) => {
  return async (dispatch: AppDispatch) => {
    dispatch(toggleState(params));
  };
};
