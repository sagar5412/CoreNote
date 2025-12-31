import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { Adapter, AdapterUser } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@/generated/prisma/client";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    async createUser(data: Omit<AdapterUser, "id">) {
      try {
        const userData = {
          ...data,
          emailVerified: data.emailVerified
            ? typeof data.emailVerified === "string"
              ? new Date(data.emailVerified)
              : data.emailVerified
            : new Date(),
        };
        const user = await adapter.createUser!(
          userData as unknown as AdapterUser
        );
        return user;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: null,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      if (trigger == "update" && session) {
        token.name = session.name;
        token.picture = session.image;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
