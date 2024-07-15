'use client'

import { Button, Input } from '@nextui-org/react'
import type { FormikHelpers, FormikProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { object, ref, string } from 'yup'

interface IResetPasswordProps {
  searchParams: {
    token: string
  }
}

const ResetPassword = ({ searchParams }: IResetPasswordProps) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false)
  const [isVisiblePasswordConfirm, setIsVisiblePasswordConfirm] =
    useState<boolean>(false)

  const toggleVisibilityPassword = () =>
    setIsVisiblePassword(!isVisiblePassword)
  const toggleVisibilityPasswordConfirm = () =>
    setIsVisiblePasswordConfirm(!isVisiblePasswordConfirm)

  const handleSubmit = async (
    values: { password: string; passwordConfirmation: string },
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
          token: searchParams.token,
          password: values.password,
          subject: 'Password Reset Successfully',
          payload: {
            name: 'Admin',
          },
          template: '/templates/resetPassword.handlebars',
        }),
      })
      if (res.status === 200) {
        toast.success('Пароль успешно обновлен!', {
          style: {
            borderRadius: '10px',
            background: 'grey',
            color: '#fff',
          },
        })
        router.push('/admin/auth/signin')
        router.refresh()
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
        <div className='flex flex-col gap-8 bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-[40px] w-full max-w-md'>
          <h3 className='mb-2 text-center text-2xl font-semibold'>
            Введите новый пароль
          </h3>
          <Formik
            initialValues={{
              password: '',
              passwordConfirmation: '',
            }}
            validationSchema={object().shape({
              password: string()
                .min(6, 'Минимальное количество символов 6')
                .required('Пожалуйста, введите пароль'),
              passwordConfirmation: string()
                .label('Подтверждение пароля')
                .oneOf([ref('password')], 'Пароль не совпадает')
                .required('Пожалуйста, подтвердите пароль'),
            })}
            onSubmit={handleSubmit}
          >
            {(props: FormikProps<any>) => (
              <Form
                onSubmit={props.handleSubmit}
                className='flex flex-col items-center justify-center gap-6'
              >
                <Field name='password'>
                  {({ meta, field }: any) => (
                    <Input
                      type={isVisiblePassword ? 'text' : 'password'}
                      isInvalid={!!(meta.touched && meta.error)}
                      errorMessage={meta.touched && meta.error && meta.error}
                      classNames={{
                        label: [
                          'text-sm',
                          'text-stone-300',
                          'group-data-[filled-within=true]:text-[#E48700]',
                        ],
                        input: ['text-sm', 'text-black'],
                        inputWrapper: [
                          'group-data-[focus=true]:border-[#E48700]',
                          'group-data-[hover=true]:border-[#E48700]',
                        ],
                      }}
                      variant='bordered'
                      label='Введите пароль'
                      labelPlacement='inside'
                      endContent={
                        <button
                          className='focus:outline-none'
                          type='button'
                          onClick={toggleVisibilityPassword}
                        >
                          {isVisiblePassword ? (
                            <AiFillEyeInvisible
                              size={45}
                              className='flex p-2 text-mid-blue'
                            />
                          ) : (
                            <AiFillEye
                              size={45}
                              className='flex p-2 text-mid-green'
                            />
                          )}
                        </button>
                      }
                      {...field}
                    />
                  )}
                </Field>
                <Field name='passwordConfirmation'>
                  {({ meta, field }: any) => (
                    <Input
                      type={isVisiblePasswordConfirm ? 'text' : 'password'}
                      variant='bordered'
                      label='Подтвердить пароль'
                      labelPlacement='inside'
                      isInvalid={!!(meta.touched && meta.error)}
                      errorMessage={meta.touched && meta.error && meta.error}
                      classNames={{
                        label: [
                          'text-sm',
                          'text-stone-300',
                          'group-data-[filled-within=true]:text-[#E48700]',
                        ],
                        input: ['text-sm', 'text-black'],
                        inputWrapper: [
                          'group-data-[focus=true]:border-[#E48700]',
                          'group-data-[hover=true]:border-[#E48700]',
                        ],
                      }}
                      endContent={
                        <button
                          className='focus:outline-none'
                          type='button'
                          onClick={toggleVisibilityPasswordConfirm}
                        >
                          {isVisiblePasswordConfirm ? (
                            <AiFillEyeInvisible
                              size={45}
                              className='flex p-2 text-mid-blue'
                            />
                          ) : (
                            <AiFillEye
                              size={45}
                              className='flex p-2 text-mid-green'
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
                  Отправить
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ResetPassword
