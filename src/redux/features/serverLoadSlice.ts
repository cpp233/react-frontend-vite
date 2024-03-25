import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import logger from '@utils/logger';

const defaultState: ServerLoadState = {
  loading: true,
  isError: false,
  MAX_LENGTH: 60,
  cpuUse: [],
  memoryUse: {
    use: {
      type: '已使用',
      value: 0,
      unit: '',
    },
    idle: {
      type: '未使用',
      value: 0,
      unit: '',
    },
  },
};

const serverLoadSlice = createSlice({
  name: 'serverLoad',
  initialState: defaultState,
  reducers: {
    update(state, action: PayloadAction<SystemInfo>) {
      const now = new Date();
      const time = now.toLocaleTimeString('zh-CN', {
        hour12: false,
      });

      const cpuUse = {
        time: time,
        use: action.payload.cpuUse.user + action.payload.cpuUse.sys,
        type: 'CPU',
      };

      if (state.cpuUse.length >= state.MAX_LENGTH) {
        state.cpuUse.shift();
      }

      state.loading = false;
      state.cpuUse.push(cpuUse);
      state.memoryUse.use.value = action.payload.memoryUse.use;
      state.memoryUse.use.unit = action.payload.memoryUse.useUnit;
      state.memoryUse.idle.value = action.payload.memoryUse.free;
      state.memoryUse.idle.unit = action.payload.memoryUse.freeUnit;

      // logger.info('serverLoadSlice.update:', { ...action.payload, time });
    },
    toggleState(state, action: PayloadAction<boolean>) {
      const isError = action.payload;

      state.isError = isError;
    },
  },
});

export const { update, toggleState } = serverLoadSlice.actions;

export default serverLoadSlice.reducer;
