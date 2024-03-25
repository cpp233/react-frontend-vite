// import { getAll, postOne, putOne, deleteOne } from '@services/jsonEdit';
import { AppDispatch } from '@redux/store';
import { readAll, readOne } from '@redux/features/noticeSlice';

export const readOneNoticeAction = (params: Notice) => {
  return async (dispatch: AppDispatch) => {
    dispatch(readOne(params));
  };
};

export const readAllNoticeAction = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(readAll(null));
  };
};
