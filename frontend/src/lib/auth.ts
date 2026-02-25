/**
 * JWT を localStorage に保存している。
 * TODO: 本番では XSS 対策のため httpOnly Cookie での保持を検討する。
 */
const TOKEN_KEY = 'ruby_app_auth_token';

/** 保存されている JWT を取得する。SSR 時は null。 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

/** JWT を保存する。 */
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

/** JWT を削除する。 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

/** JWT の payload の exp（秒）をデコードする。不正なトークンは null。base64url (RFC 7515) を標準 base64 に変換してから atob。 */
function decodeExp(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decoded = JSON.parse(atob(padded)) as { exp?: number };
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}

/**
 * トークンが存在し、有効期限（exp）が切れていなければ true。
 * 1 秒のマージンを持たせて判定する。
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;
  const exp = decodeExp(token);
  if (exp === null) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return exp > nowSec + 1;
};
