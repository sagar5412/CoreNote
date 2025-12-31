import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface User extends DefaultUser {
    id: string;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
