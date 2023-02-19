import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import jwt from "jsonwebtoken"
import { prisma } from 'lib/prisma';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  // not sure if we should use Prisma or Supabase here
  // adapter: PrismaAdapter(prisma),
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  }),
  callbacks: {
    async session({ session, user }) {
      console.log("authOptions session", session)
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: 'authenticated',
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: 'authenticated',
        };
        (session as any).supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      console.log("authOptions session", session)
      return session;
    },
  },
  secret: process.env.SUPABASE_JWT_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
