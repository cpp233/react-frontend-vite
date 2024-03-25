interface Cache {
  key: {
    path: string;
    requestQuery: unknown;
    requestBody: unknown;
  };
  value: {
    cacheExpire: number;
    hitCount: number;
    cachedData: string;
  };
}
