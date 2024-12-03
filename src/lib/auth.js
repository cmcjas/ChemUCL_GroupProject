import CredentialsProvider from 'next-auth/providers/credentials';
import { findUser } from 'db/queries/User';

const makeTokenRequest = async (context) =>
  fetch(
    `${context.provider.token.url}?code=${context.params.code}&client_id=${context.client.client_id}&client_secret=${context.client.client_secret}`
  ).then((res) => res.json());

const makeUserInfoRequest = async (context) =>
  fetch(`${context.provider.userinfo.url}?client_secret=${context.client.client_secret}&token=${context.tokens.access_token}`).then((res) =>
    res.json()
  );

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // One day idle session expiry
  },
  providers: [
    {
      id: 'uclapi',
      name: 'UCL API',
      params: { grant_type: 'authorization_code' },
      type: 'oauth',
      authorization: `${process.env.UCLAPI_URL}/oauth/authorise`,
      token: {
        url: `${process.env.UCLAPI_URL}/oauth/token`,
        async request(context) {
          const tokens = await makeTokenRequest(context);
          return { tokens };
        }
      },
      userinfo: {
        url: `${process.env.UCLAPI_URL}/oauth/user/data`,
        async request(context) {
          return await makeUserInfoRequest(context);
        }
      },
      clientId: process.env.UCL_API_CLIENT_ID,
      clientSecret: process.env.UCL_API_CLIENT_SECRET,
      async profile(profile) {
        const userAccess = (await findUser({ email: profile.email }))[0];
        if (!userAccess) {
          return null;
        } else {
        return {
          id: profile.cn,
          name: profile.full_name,
          email: profile.email,
          permission: userAccess.permission,
          // image: ''
        };
      }
      }
    }
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.permission && session?.user) {
        session.user.role= token.permission;
      }
      return session;
    },
    jwt: async ({ token, profile }) => {
      // console.log('jwt callback called');
      if (profile) {
        const user = (await findUser({ email: profile.email }))[0];
        if (user) {
          token.permission = user.permission;
        }
      }
      return token;
    }
  },
  events: {
    signIn: async (message) => {
      // Fired on successful logins
      // Make sure our database is up to date with this user's details
      // If they don't exist, add them
      console.log('Sign in event', message);
    }
  }
};
