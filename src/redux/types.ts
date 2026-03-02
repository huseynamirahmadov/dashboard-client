// Redux State and Action Types
export interface AppState {
  trades: {
    data: any[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
  };
}

export interface ThunkApiConfig {
  state: AppState;
  rejectValue: string;
}
