import { get } from '@utils/request';

const TAGS_API_V1 = '/api/v1/admin/tags';

export const getList = () => {
  return get<Tag[]>(TAGS_API_V1).then(data => {
    // message.success('')
    // logger.trace(data);
    return data;
  });
};
