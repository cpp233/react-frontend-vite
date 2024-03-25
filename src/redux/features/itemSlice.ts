import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import logger from '@utils/logger';
import { number } from 'zod';
// import { Item } from '@types/item';

const defaultState: ItemState = {
  loading: true,
  totalCount: 0,
  keyword: '',
  list: [],
  filterList: [],
  currentPage: 1,
  currentPageSize: 15,
};

const itemSlice = createSlice({
  name: 'items',
  initialState: defaultState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      const page = action.payload;
      state.currentPage = page;
    },
    setPageSize(state, action: PayloadAction<number>) {
      const pageSize = action.payload;
      state.currentPageSize = pageSize;
    },
    addTotalCount(state, action: PayloadAction<number>) {
      const count = action.payload;
      state.totalCount += count;
    },
    setList(state, action: PayloadAction<ListPayload>) {
      const { totalCount, list } = action.payload;

      state.loading = false;
      state.totalCount = totalCount;
      state.list = list;
      state.filterList = list;

      // return {
      //   ...state,
      //   loading: false,
      //   totalCount: action.payload.totalCount,
      //   list: action.payload.list,
      //   filterList: action.payload.list,
      // };
    },
    setFilter(state, _action: PayloadAction<void>) {
      // const keywork = action.payload;
      const keywork = state.keyword;
      if (keywork === '') {
        state.filterList = state.list;
        return;
      }
      state.filterList = state.list.filter(item => {
        // 从 原始 list 中，找出所有包含关键字的
        for (const [key, value] of Object.entries(item)) {
          // 跳过
          if (
            key.toLowerCase() === 'id' ||
            key === 'isShow' ||
            key === 'user'
          ) {
            continue;
          }

          // logger.trace({ key, value: String(value) });
          // 手动处理 tagList tagList2
          if (key === 'tagList' || key === 'tagList2') {
            const arrToString = JSON.stringify(
              item[key]?.map(item => {
                if (typeof item === 'string') {
                  return item;
                }

                if (item.id) {
                  return item.name;
                }
                return item;
              })
            );
            logger.trace({ key, value: arrToString });
            if (arrToString.includes(keywork.toLowerCase())) {
              return true;
            }
            // return arrToString.includes(keywork.toLowerCase());
          }
          // 自动处理
          if (String(value).toLowerCase().includes(keywork.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    },
    updateKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
    createOne(state, action: PayloadAction<Item>) {
      const newItem = action.payload;

      if (state.list.length >= state.currentPageSize) {
        state.list.pop();
      }

      state.list = [newItem].concat(state.list);
    },
    updateOne(state, action: PayloadAction<Item>) {
      const updatedItem = action.payload;
      state.list = state.list.map(item => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        return item;
      });
    },
    // 废弃
    deleteList(state, action: PayloadAction<React.Key[]>) {
      const idList = action.payload;
      state.list = state.list.filter(item => {
        if (idList.includes(item.id)) {
          return false;
        }
        return true;
      });
      state.filterList = state.filterList.filter(item => {
        if (idList.includes(item.id)) {
          return false;
        }
        return true;
      });
    },
  },
});

export const {
  setPage,
  setPageSize,
  addTotalCount,
  setList,
  setFilter,
  updateKeyword,
  createOne,
  updateOne,
  deleteList,
} = itemSlice.actions;

export default itemSlice.reducer;
