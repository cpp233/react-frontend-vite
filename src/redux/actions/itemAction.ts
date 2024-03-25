import {
  getList,
  putOneById,
  postOne,
  delOneById,
  delListById,
} from '@services/itemService';
import { getList as getTagList } from '@services/tagService';
import { AppDispatch } from '@redux/store';
import {
  setPage,
  setPageSize,
  addTotalCount,
  setList,
  setFilter,
  updateKeyword,
  createOne,
  updateOne,
} from '@redux/features/itemSlice';
import { setTagList, setTagLoading } from '@redux/features/tagSlice';
import logger from '@utils/logger';

export const setPageAction = (params: number) => {
  return async (dispatch: AppDispatch) => {
    const newPage = params;
    dispatch(setPage(newPage));
  };
};

export const setPageSizeAction = (params: number) => {
  return async (dispatch: AppDispatch) => {
    const newPageSize = params;
    dispatch(setPageSize(newPageSize));
  };
};

export const getItemListAction = (params?: {
  page?: number;
  per?: number;
  keyword?: string;
}) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await getList({
      ...params,
    });
    // logger.trace('getItemListAction', data);
    dispatch(setList(data));
    dispatch(setFilter());
  };
};

export const updateKeywordAction = (params: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(updateKeyword(params));
  };
};

export const filterItemListAction = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setFilter());
  };
};

// 新增后获取列表
export const createOneItemAction = (params: NewItem) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setTagLoading(true));

    const { data } = await postOne(params);
    // logger.trace(data);
    dispatch(createOne(data));
    dispatch(setFilter());
    dispatch(addTotalCount(1));

    const { data: tagData } = await getTagList();
    dispatch(setTagList(tagData));
  };
};

export const updateOneItemAction = (params: { body: NewItem; id: string }) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setTagLoading(true));

    const { data } = await putOneById({ id: params.id, body: params.body });
    dispatch(updateOne(data));
    dispatch(setFilter());

    const { data: tagData } = await getTagList();
    dispatch(setTagList(tagData));
  };
};

export const delItemListAction = (params: {
  selectedRowKeys: React.Key[];
  page: number;
  per: number;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setTagLoading(true));

    logger.trace(params);
    const { selectedRowKeys, page, per } = params;
    if (selectedRowKeys.length === 1) {
      const id = selectedRowKeys[0];
      await delOneById(String(id));
    } else {
      const idList = selectedRowKeys.map(item => String(item)).join(',');
      await delListById(idList);
    }

    // dispatch(deleteList(selectedRowKeys));

    const { data } = await getList({
      ...params,
    });
    dispatch(setList(data));
    dispatch(setFilter());

    const { data: tagData } = await getTagList();
    dispatch(setTagList(tagData));
  };
};
