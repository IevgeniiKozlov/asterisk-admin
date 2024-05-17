'use client'

import { Button, Input } from '@nextui-org/react'
import type { FormikHelpers, FormikProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiMail } from 'react-icons/hi'
import { object, string } from 'yup'

const ForgotPassword = () => {
  const { data: session } = useSession()

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting, resetForm }: FormikHelpers<any>,
  ) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          subject: 'Password Reset Request',
          payload: {
            name: 'Admin',
          },
          template: '/templates/requestResetPassword.handlebars',
        }),
      })
      if (res.status === 200) {
        toast.success('Запрос отправлен! Проверьте почту', {
          style: {
            borderRadius: '10px',
            background: 'grey',
            color: '#fff',
          },
        })
      }
      resetForm()
    } catch (error: any) {
      toast.error(error.message, {
        style: {
          borderRadius: '10px',
          background: 'red',
          color: '#fff',
        },
      })
    }
    setSubmitting(false)
  }

  if (session && session.user.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className='flex flex-col gap-8 bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md'>
      <h3 className='mb-2 text-center text-2xl font-semibold'>
        Восстановление пароля
      </h3>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={object().shape({
          email: string()
            .max(30, 'Почта не должна превышать 30 символов')
            .email('Неверный email адрес')
            .required('Введите ваш email'),
        })}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<any>) => (
          <Form
            onSubmit={props.handleSubmit}
            className='flex flex-col items-center justify-center gap-6'
          >
            <Field name='email'>
              {({ meta, field }: any) => (
                <Input
                  type='email'
                  variant='bordered'
                  label='Введите почту'
                  labelPlacement='inside'
                  isInvalid={!!(meta.touched && meta.error)}
                  errorMessage={meta.touched && meta.error && meta.error}
                  classNames={{
                    label: [
                      'font-base',
                      'text-md',
                      'text-white-dis',
                      'group-data-[filled-within=true]:text-mid-blue',
                    ],
                    input: ['font-base', 'text-md', 'text-white-dis'],
                    inputWrapper: ['group-data-[focus=true]:border-mid-green'],
                  }}
                  endContent={
                    <HiMail
                      size={45}
                      className='flex items-center p-2 text-mid-green'
                    />
                  }
                  {...field}
                />
              )}
            </Field>
            <Button
              type='submit'
              disabled={!props.isValid}
              isLoading={props.isSubmitting}
              className='w-full py-6 rounded-xl text-center text-xl font-bold'
            >
              Отправить запрос
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ForgotPassword
