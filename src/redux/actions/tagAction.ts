import { getList } from '@services/tagService';
import { AppDispatch } from '@redux/store';
import { setTagList, setTagLoading } from '@redux/features/tagSlice';
import logger from '@utils/logger';

export const getTagListAction = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setTagLoading(true));

    const { data } = await getList();
    // logger.trace('getTagListAction', data);
    dispatch(setTagList(data));
  };
};
