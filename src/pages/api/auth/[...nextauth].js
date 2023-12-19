import { user, userActivity } from '../_services'
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials

        try {
          const User = await new user().auth(email, password)
          await new userActivity().insert(User.id, 'Logged in', req)

          return User
        } catch (error) {
          throw new Error(error.message)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 900 //15 min
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/404'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const User = await new user().find(token.id)

        session.user.id = User.id
        session.user.role = User.role
        session.user.email = User.email
        session.user.password = User.password
        session.user.status = User.status
        session.user.created_at = User.created_at
        session.user.updated_at = User.updated_at
        session.user.email_verified_at = User.email_verified_at
        session.user.remember_token = User.remember_token
        session.user.fullname = User.fullname
        session.user.phone = User.phone
        session.user.zipcode = User.zipcode
        session.user.fulladdress = User.fulladdress
        session.user.cpf = User.cpf
        session.user.number = User.number
        session.user.obs = User.obs
        session.user.avatar = User.avatar
      }

      return session
    }
  }
}

export default NextAuth(authOptions)
