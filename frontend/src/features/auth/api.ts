import apiClient from '@/lib/axios';

/** 登録 API の成功レスポンス */
export type RegisterResponse = { message: string };

/** ログイン API の成功レスポンス */
export type LoginResponse = { token: string };

/** 登録 */
export async function register(params: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    '/api/auth/register',
    params
  );
  return data;
}

/** ログイン。成功時は token を返す。 */
export async function login(params: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/login', params);
  return data;
}
