export interface User {
    id: number;
    username: string;
    name?: string; // Bu sətir AuthStatus-dakı qırmızı xətti itirəcək
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface AuthResponse {
    user: User;
    token: string;
}