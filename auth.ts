import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { getUserByEmail, createUser } from '@/lib/db/users'
import { emailPasswordSchema } from '@/lib/validation'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = emailPasswordSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await getUserByEmail(parsed.data.email)
        if (!user?.passwordHash) return null

        const valid = await compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
        }
      },
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
    async session({ session }) {
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
