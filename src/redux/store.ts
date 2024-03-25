import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import itemsReducer from '@redux/features/itemSlice';
import tagSlice from '@redux/features/tagSlice';
import noticesReducer from '@redux/features/noticeSlice';
import serverLoadReducer from '@redux/features/serverLoadSlice';
import { socketMiddleware } from '@redux/middleware/socketMiddleware';
import { Socket } from '@utils/webSocket';

const store = configureStore({
  reducer: {
    items: itemsReducer,
    tags: tagSlice,
    serverLoad: serverLoadReducer,
    notices: noticesReducer,
  },
  // middleware: [
  //   socketMiddleware(new Socket()),
  //   ...getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: ['serverLoad/init'],
  //       // ignoredActionPaths: [''],
  //       ignoredPaths: ['serverLoad.ws'],
  //     },
  //   }),
  // ],
  middleware: getDefaultMiddleware => {
    const ws = new Socket();
    // ws.addFailRetry();
    // return [...getDefaultMiddleware(), socketMiddleware(new Socket())];
    return getDefaultMiddleware().concat(socketMiddleware(ws));
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
