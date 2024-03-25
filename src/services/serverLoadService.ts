// 废弃
import { get } from '@utils/request';

const SERVERLOAD_API_V1 = '/api/v1/admin/server_load';

export const getServerLoad = () => {
  return get(SERVERLOAD_API_V1);
};
