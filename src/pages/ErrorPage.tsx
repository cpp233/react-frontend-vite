import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import logger from '@utils/logger';
import './ErrorPage.css';

function ErrorPage() {
  const error = useRouteError();
  logger.error('ErrorPage.useRouteError:', error);

  if (isRouteErrorResponse(error)) {
    return (
      <div id='error-page'>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          {error.status} {error.statusText}
        </p>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div id='error-page'>
        <h1>Oops! Unexpected Error</h1>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  }

  return (
    <div id='error-page'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{'Unknown Error'}</i>
      </p>
    </div>
  );
}

export default ErrorPage;
