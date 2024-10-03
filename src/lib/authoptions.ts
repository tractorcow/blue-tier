import type { Account, AuthOptions, Profile } from 'next-auth'
import { DefaultUser } from 'next-auth'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord'
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string
//     } & DefaultUser
//   }
// }

/**
 * Safely check if a profile is a Discord profile
 * @param account
 * @param profile
 */
const isDiscordProfile = (account: Account, profile?: Profile | null): profile is DiscordProfile => {
  return account.provider === 'discord' && !!profile
}

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // async session({ session, user }) {
    //   session.user.id = user.id;
    //   return session;
    // },
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   return token;
    // },
    // async signIn({ user, account, profile }) {
    //   if (user && account && isDiscordProfile(account, profile)) {
    //     // Look up existing discord account
    //     // await prisma.$transaction([
    //     //   prisma.user.upsert({
    //     //     where: { id: user.id },
    //     //     update: {
    //     //       name: profile.username,
    //     //       email: profile.email, // Include other relevant fields if needed
    //     //       image: profile.avatar, // Discord avatar URL
    //     //     },
    //     //     create: {
    //     //       id: user.id,
    //     //       name: profile.username,
    //     //       email: profile.email, // Include other relevant fields if needed
    //     //       image: profile.avatar, // Discord avatar URL
    //     //     }
    //     //   }),
    //       // prisma.account.upsert({
    //       //   where: {
    //       //     provider_providerAccountId: {
    //       //       provider: account.provider,
    //       //       providerAccountId: account.providerAccountId,
    //       //     },
    //       //   },
    //       //   update: {
    //       //     access_token: account.access_token,
    //       //     refresh_token: account.refresh_token,
    //       //     expires_at: account.expires_at,
    //       //     token_type: account.token_type,
    //       //     scope: account.scope,
    //       //     id_token: account.id_token,
    //       //     session_state: account.session_state,
    //       //   },
    //       //   create: {
    //       //     userId: user.id,
    //       //     provider: account.provider,
    //       //     providerAccountId: account.providerAccountId,
    //       //     type: account.type,
    //       //     access_token: account.access_token,
    //       //     refresh_token: account.refresh_token,
    //       //     expires_at: account.expires_at,
    //       //     token_type: account.token_type,
    //       //     scope: account.scope,
    //       //     id_token: account.id_token,
    //       //     session_state: account.session_state,
    //       //   },
    //       // })
    //     // ]);
    //   }
    //   return true;
    // }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
}

export default authOptions
