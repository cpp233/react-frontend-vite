import { get } from '@utils/request';

const CACHE_API_V1 = '/api/v1/debug/cache';

export const getCacheList = () => {
  return get<Cache[]>(`${CACHE_API_V1}`);
};
