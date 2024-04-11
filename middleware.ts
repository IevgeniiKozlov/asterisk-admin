import NextAuth from 'next-auth'
import { authOptions } from './app/(utils)/next-auth/auth'

export default NextAuth(authOptions).auth

export const config = {
  matcher: ['/', '/authentication/signin', '/admin'],
}
