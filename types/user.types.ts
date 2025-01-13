export type UserType = "staff" | "admin" | "super_admin";

// types/auth.types.ts
export type UserRole = "super_admin" | "admin" | "staff";

interface TokenPayload {
  id: number;
  username: string;
  userType: UserRole;
}

export interface LoginCredentials {
    username: string;
    password: string;
}
