import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { getUserByEmail, createUser } from '@/lib/db/users'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      const existing = await getUserByEmail(user.email)
      if (!existing) {
        await createUser(user.email)
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const { getUserByEmail } = await import('@/lib/db/users')
        const dbUser = await getUserByEmail(session.user.email)
        if (dbUser) {
          session.user.id = dbUser.id
          session.user.planTier = dbUser.planTier
          session.user.monthlyUsage = dbUser.monthlyUsage
        }
      }
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
})
