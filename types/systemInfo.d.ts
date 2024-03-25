interface CpuPayload {
  idle: number;
  user: number;
  sys: number;
  irq: number;
}

interface MemoryPayload {
  free: number;
  freeUnit: string;
  use: number;
  useUnit: string;
}

interface CPUUse {
  type: string;
  use: number;
  time: string;
}

interface MemoryUse {
  use: {
    type: '已使用';
    value: number;
    unit: string;
  };
  idle: {
    type: '未使用';
    value: number;
    unit: string;
  };
}

interface SystemInfo {
  cpuUse: CpuPayload;
  memoryUse: MemoryPayload;
}

interface ServerLoadState {
  loading: boolean;
  isError: boolean;
  MAX_LENGTH: 60;
  cpuUse: CPUUse[];
  memoryUse: MemoryUse;
}
