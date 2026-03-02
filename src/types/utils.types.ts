// Utility Types
export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface Pageable {
  page: number;
  pageSize: number;
  total?: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
