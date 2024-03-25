import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import logger from '@utils/logger';

const fakeData: string[] = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const defaultState: Notice[] = fakeData.map((notice, index) => {
  return {
    id: index,
    notice,
    isRead: false,
  };
});

const noticesSlice = createSlice({
  name: 'notices',
  initialState: defaultState,
  reducers: {
    readAll(state, action: PayloadAction<null>) {
      state.map(notice => {
        notice.isRead = true;
        return notice;
      });
    },
    readOne(state, action: PayloadAction<Notice>) {
      state.map(notice => {
        if (notice.id === action.payload.id) {
          notice.isRead = true;
        }
        return notice;
      });
    },
  },
});

export const { readAll, readOne } = noticesSlice.actions;

export default noticesSlice.reducer;
