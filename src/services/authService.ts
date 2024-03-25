import { post } from '@utils/request';

const LOGIN_API_V1 = '/api/v1/admin/login';
const REGISTER_API_V1 = '/api/v1/admin/users';

export const login = (data: { username: string; password: string }) => {
  return post<LoginSuccess>(LOGIN_API_V1, data);
};

export const register = (data: {
  username: string;
  password: string;
  // confirmPassword: string;
}) => {
  return post(REGISTER_API_V1, data);
};
