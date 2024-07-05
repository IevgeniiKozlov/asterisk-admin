'use client'

import { Button, Image, Input } from '@nextui-org/react'
import type { FormikHelpers, FormikProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { signIn, useSession } from 'next-auth/react'
import NextImage from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FiLogIn } from 'react-icons/fi'
import { HiMail } from 'react-icons/hi'
import { object, string } from 'yup'

const SignIn = () => {
  const { data: session } = useSession()

  const [isVisiblePassword, setIsVisiblePassword] = useState(false)
  const toggleVisibilityPassword = () =>
    setIsVisiblePassword(!isVisiblePassword)

  const handleSubmit = async (
    values: { login: string; password: string },
    { setSubmitting }: FormikHelpers<any>,
  ) => {
    setSubmitting(true)
    try {
      const res = await signIn('admin', {
        login: values.login,
        password: values.password,
        role: 'admin',
        redirect: false,
        callbackUrl: '/admin',
      })

      if (res && !res.error) {
        toast.success('Приветствуем в Admin Panel!', {
          style: {
            borderRadius: '10px',
            background: 'grey',
            color: '#fff',
          },
        })
      } else {
        throw new Error(
          'Ошибка авторизации, проверьте правильность ввода почты и пароля',
        )
      }
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
    <AnimatePresence>
      <motion.div
        className='flex flex-col gap-8'
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: 'spring',
            damping: 5,
            stiffness: 100,
            restDelta: 0.001,
          },
        }}
      >
        <div className='w-[400px] flex flex-col items-center justify-center gap-8 sm:shadow-xl px-8 py-8 pt-12 bg-white rounded-[40px] z-20'>
          <Image
            as={NextImage}
            src='/Asterisk_logo.png'
            width={200}
            height={100}
            alt='asterisk info'
          />
          <h3 className='mb-4 text-zinc-500 text-center text-xl font-semibold'>
            Вход в кабинет суперпользователя
          </h3>
          <Formik
            initialValues={{ login: '', password: '' }}
            validationSchema={object().shape({
              login: string().required('Введите Вашу почту'),
              password: string().required('Введите Ваш пароль'),
            })}
            onSubmit={handleSubmit}
          >
            {(props: FormikProps<any>) => (
              <Form
                onSubmit={props.handleSubmit}
                className='flex flex-col flex-wrap items-center justify-center gap-6'
              >
                <Field name='login'>
                  {({ meta, field }: any) => (
                    <Input
                      type='email'
                      variant='bordered'
                      label='Введите логин'
                      labelPlacement='inside'
                      isInvalid={!!(meta.touched && meta.error)}
                      errorMessage={meta.touched && meta.error && meta.error}
                      classNames={{
                        label: [
                          'font-base',
                          'text-md',
                          'group-data-[filled-within=true]:text-[#E48700]',
                        ],
                        input: ['font-base', 'text-md'],
                        inputWrapper: [
                          'group-data-[focus=true]:border-[#E48700]',
                        ],
                      }}
                      endContent={
                        <HiMail
                          size={45}
                          className='flex items-center p-2 text-[#E48700]'
                        />
                      }
                      {...field}
                    />
                  )}
                </Field>
                <Field name='password'>
                  {({ meta, field }: any) => (
                    <Input
                      type={isVisiblePassword ? 'text' : 'password'}
                      variant='bordered'
                      isInvalid={!!(meta.touched && meta.error)}
                      errorMessage={meta.touched && meta.error && meta.error}
                      label='Введите пароль'
                      labelPlacement='inside'
                      classNames={{
                        label: [
                          'font-base',
                          'text-md',
                          'group-data-[filled-within=true]:text-[#E48700]',
                        ],
                        input: ['font-base', 'text-md'],
                        inputWrapper: [
                          'group-data-[focus=true]:border-[#E48700]',
                        ],
                      }}
                      endContent={
                        <button
                          className='focus:outline-none'
                          type='button'
                          onClick={toggleVisibilityPassword}
                        >
                          {isVisiblePassword ? (
                            <AiFillEyeInvisible
                              size={45}
                              className='flex p-2 text-[#E48700]'
                            />
                          ) : (
                            <AiFillEye
                              size={45}
                              className='flex p-2 text-[#E48700]'
                            />
                          )}
                        </button>
                      }
                      {...field}
                    />
                  )}
                </Field>
                <Button
                  type='submit'
                  disabled={!props.isValid}
                  isLoading={props.isSubmitting}
                  className='w-full bg-[#E48700] py-6 rounded-xl text-center text-white text-lg font-semibold'
                >
                  Войти
                  <FiLogIn className='text-xl' />
                </Button>
              </Form>
            )}
          </Formik>
          <Link
            className='text-xl text-zinc-500 text-center font-semibold transition duration-300 hover:scale-[1.03] focus:scale-[1.03]'
            href='/admin/auth/forgot-password'
          >
            Забыли пароль?
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SignIn
