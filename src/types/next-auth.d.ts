import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, and received as a prop on the client
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];

    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  /**
   * User object returned in `authorize` or OAuth `profile`
   */
  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT token stored in cookies
   */
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
