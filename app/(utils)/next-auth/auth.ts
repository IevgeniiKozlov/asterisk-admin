import { createCaller } from '@/app/api/trpc/trpc-router'
import type { Session } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: any = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/authentication/signin',
  },
  providers: [
    CredentialsProvider({
      id: 'admin',
      name: 'Credentials',
      credentials: {
        login: {
          label: 'Login',
          type: 'email',
        },
        password: { label: 'Password', type: 'password' },
        role: { type: 'string' },
      },
      async authorize(credentials: any): Promise<any> {
        const response = await createCaller({}).loginAdmin({
          login: credentials.login,
          password: credentials.password,
        })

        if (response) {
          return response
        }

        return Promise.reject(
          'Ошибка авторизации, проверьте правильность ввода логина и пароля',
        )
      },
    }),
    CredentialsProvider({
      id: 'user',
      name: 'Credentials',
      credentials: {
        login: {
          label: 'Login',
          type: 'text',
        },
        password: { label: 'Password', type: 'password' },
        role: { type: 'string' },
      },
      async authorize(credentials: any): Promise<any> {
        const response = await createCaller({}).loginUser({
          login: credentials.login,
          password: credentials.password,
        })

        if (response) {
          return response
        }

        return Promise.reject(
          'Ошибка авторизации, проверьте правильность ввода логина и пароля',
        )
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    authorized: ({ auth, request }: { auth: any; request: any }) => {
      // Check if the user is authenticated
      const isLoggedInAdmin = !!auth?.user && auth.user.role === 'admin'
      const isLoggedInUser = !!auth?.user && auth.user.role === 'user'
      // Initialize protected routes
      // Here, all routes except the login page is protected
      const isOnProtectedAdmin =
        !request.nextUrl.pathname.startsWith('/admin/auth/signin')
      const isAdmin =
        request.nextUrl.pathname
          .split('/')
          .filter((item: string) => item.trim() !== '')[0] === 'admin'
      if (isAdmin) {
        if (isOnProtectedAdmin) {
          if (isLoggedInAdmin) {
            return true
          }
          return Response.redirect(
            new URL('/admin/auth/signin', request.nextUrl),
          )
        } else if (isLoggedInAdmin) {
          // redirected to homepage
          return Response.redirect(new URL('/admin', request.nextUrl))
        }
      } else {
        const isOnProtectedUser = !request.nextUrl.pathname.startsWith(
          '/authentication/signin',
        )

        if (isOnProtectedUser) {
          if (isLoggedInUser) return true
          return false // redirect to /login
        } else if (isLoggedInUser) {
          // redirected to homepage
          return Response.redirect(new URL('/', request.nextUrl))
        }
        return true
      }
    },
    // redirect: async ({ url, baseUrl }: { url: string; baseUrl: string }) => {
    //   console.log('TTTEEESSTST')
    //   if (url.startsWith('/admin')) return `${baseUrl}${url}`
    //   else if (new URL(url).origin === baseUrl) return url
    //   return baseUrl
    // },
    jwt: async ({ token, user }: { token: any; user: any }): Promise<any> => {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }
      return token
    },
    session: async ({
      session,
      token,
    }: {
      session: Session
      token: any
    }): Promise<any> => {
      return {
        ...session,
        user: {
          id: token.userId,
          role: token.role,
        },
      }
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
