import { sendEmail } from '@/app/(utils)/nodemailer/sendEmail'
import prisma from '@/prisma/prisma-client'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: any) {
  try {
    const dataResponse = await request.json()
    const { token, password, email, subject, payload, template } = dataResponse

    if (email) {
      const passwordResetToken = uuidv4()
      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auth/reset-password?token=${passwordResetToken}`
      await prisma.user.update({
        where: { login: email },
        data: {
          emailResetPassword: passwordResetToken,
          passwordResetTokenExpires: new Date(),
        },
      })
      await sendEmail({
        email,
        subject,
        payload: {
          ...payload,
          link,
        },
        template,
      })
    } else if (token && password) {
      const user = await prisma.user.findUnique({
        where: {
          emailResetPassword: token,
        },
      })

      await prisma.user.update({
        where: { id: user!.id },
        data: {
          ...user,
          password: await hash(password, 10),
          emailResetPassword: null,
          passwordResetTokenExpires: null,
        },
      })
      await sendEmail({
        email: user!.login,
        subject,
        payload,
        template,
      })
    }

    return NextResponse.json(
      { message: 'Email успешно отправлен!' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Не удалось отправить email!' },
      { status: 500 },
    )
  }
}
