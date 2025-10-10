export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
    [key: string]: unknown;
}

export interface DecodedToken {
  id: string | number;
  email: string;
  name: string;
  role?: string;
}