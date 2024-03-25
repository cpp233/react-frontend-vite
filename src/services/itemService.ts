// import { AxiosResponse } from 'axios';
import { message } from 'antd';
import { get, post, put, del } from '@utils/request';
import logger from '@utils/logger';

const ITEMS_API_V1 = '/api/v1/admin/items';

export const getList = ({ page = 1, per = 10, keyword = '' }) => {
  return get<ListPayload>(ITEMS_API_V1, { page, per, keyword }).then(data => {
    // message.success('')
    // logger.trace(data);
    return data;
  });
};

export const getOneById = (id: string) => {
  return get<Item>(`${ITEMS_API_V1}/${id}`);
};

export const postOne = (data: NewItem) => {
  return post<Item>(ITEMS_API_V1, data).then(data => {
    message.success('新增成功');
    return data;
  });
};

export const putOneById = ({ id, body }: { id: string; body: NewItem }) => {
  return put<Item>(`${ITEMS_API_V1}/${id}`, body).then(data => {
    message.success('修改成功');
    return data;
  });
};

export const delOneById = (id: string) => {
  return del(`${ITEMS_API_V1}/${id}`).then(data => {
    message.success('删除成功');
    return data;
  });
};

export const delListById = (idList: string) => {
  return del(`${ITEMS_API_V1}/?idList=${idList}`).then(data => {
    message.success('批量删除成功');
    return data;
  });
};
