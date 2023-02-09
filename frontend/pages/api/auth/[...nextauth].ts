/* eslint-disable new-cap */
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Session } from 'next-auth/core/types';
import { JWT } from 'next-auth/jwt/types';
import { SessionUser } from '../../../types';
import { client } from '../../../utils/client';

const GOOGLE_AUTHORIZATION_URL: string =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  });

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
  ];

  return await NextAuth(req, res, {
    providers,
    secret: process.env.JWT_SECRET,
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    session: {
      // This is the default. The session is saved in a cookie and never persisted anywhere.
      strategy: 'jwt',
    },
    // Enable debug messages in the console if you are having problems
    debug: true,

    callbacks: {
      async signIn({ user }) {
        if (user) {
          const newUser = {
            _id: user.id,
            _type: 'user',
            userName: user.name,
            image: user.image,
          };
          await client.createIfNotExists(newUser);
        }
        return true;
      },

      async session({
        session,
        token,
      }: {
        session: Session;
        token: JWT;
      }): Promise<SessionUser> {
        // Send properties to the client, like an access_token from a provider.
        // session.accessToken = token.accessToken;
        // session.refreshToken = token.refreshToken;
        // session.idToken = token.idToken;
        // session.provider = token.provider;
        const sessionUser: SessionUser = {
          id: token.id as string,
          ...session,
        };

        return sessionUser;
      },

      async jwt({ token, user }) {
        // Persist the OAuth access_token to the token right after signin
        // if (account) {
        //   token.accessToken = account.access_token;
        //   token.refreshToken = account.refresh_token;
        //   token.idToken = account.id_token;
        //   token.provider = account.provider;
        // }
        if (user) {
          token.id = user.id.toString();
        }
        return token;
      },
    },
  });
}
