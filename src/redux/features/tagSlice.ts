import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const defaultState: TagState = {
  loading: true,
  totalCount: 0,
  list: [],
};

const tagSlice = createSlice({
  name: 'tags',
  initialState: defaultState,
  reducers: {
    setTagList(state, action: PayloadAction<Tag[]>) {
      const list = action.payload;
      state.list = list.map(item => item.name);
      state.loading = false;
    },
    setTagLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setTagList, setTagLoading } = tagSlice.actions;

export default tagSlice.reducer;
