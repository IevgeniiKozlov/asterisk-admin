import { DefaultSession } from 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      name: string
    }
    expires: string
  }
}
