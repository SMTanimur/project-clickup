export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export function generateToken(payload: JWTPayload): string {
  // Simple base64 encoding for client-side token
  return btoa(JSON.stringify(payload));
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return JSON.parse(atob(token)) as JWTPayload;
  } catch {
    return null;
  }
}
