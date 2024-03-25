import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogin } from '@utils/auth';
import logger from '@utils/logger';

interface Props {
  children: React.ReactElement;
}

export const ProtectedRoute = ({ children }: Props): React.ReactElement => {
  const isAuth = isLogin();
  // logger.trace('ProtectedRoute', isAuth);
  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return children;
};
