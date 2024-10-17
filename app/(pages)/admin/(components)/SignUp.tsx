'use client'

import { trpc } from '@/app/(utils)/trpc/trpc'
import { Button, Input } from '@nextui-org/react'
import type { FormikHelpers, FormikProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaUserAlt } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import { object, ref, string } from 'yup'

const SignUp = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false)
  const [isVisiblePasswordConfirm, setIsVisiblePasswordConfirm] =
    useState<boolean>(false)

  const toggleVisibilityPassword = () =>
    setIsVisiblePassword(!isVisiblePassword)
  const toggleVisibilityPasswordConfirm = () =>
    setIsVisiblePasswordConfirm(!isVisiblePasswordConfirm)

  const createAdmin = trpc.registerAdmin.useMutation({
    onSettled: () => {},
    onSuccess: () => {
      toast.success(`Админ зарегистрирован!`, {
        style: {
          borderRadius: '10px',
          background: 'grey',
          color: '#fff',
        },
      })
      router.push('/admin/auth/signin')
    },
    onError: error => {
      toast.error(error.message, {
        style: {
          borderRadius: '10px',
          background: 'red',
          color: '#fff',
        },
      })
    },
  })

  const handleSubmit = async (
    values: {
      name: string
      email: string
      password: string
      passwordConfirmation: string
    },
    { setSubmitting }: FormikHelpers<any>,
  ) => {
    setSubmitting(true)
    const { passwordConfirmation, ...restData } = values
    const userData = {
      name: restData.name,
      login: restData.email,
      password: restData.password,
      role: 'admin',
      operators: null,
    }
    await createAdmin.mutateAsync(userData)
    setSubmitting(false)
  }

  if (session && session.user.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className='flex flex-col gap-8 bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md'>
      <h3 className='mb-4 text-zinc-500 text-center text-xl font-semibold'>
        Регистрация суперпользователя
      </h3>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          passwordConfirmation: '',
        }}
        validationSchema={object().shape({
          name: string()
            .min(3, 'Минимальное имя состоит из 3 символов')
            .required('Пожалуйста, введите ваше имя'),
          email: string()
            .max(30, 'Почта не должна превышать 30 символов')
            .email('Неверный email адрес')
            .required('Введите ваш email'),
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
            <Field name='name'>
              {({ meta, field }: any) => (
                <Input
                  type='text'
                  variant='bordered'
                  label='Имя'
                  labelPlacement='inside'
                  isInvalid={!!(meta.touched && meta.error)}
                  errorMessage={meta.touched && meta.error && meta.error}
                  classNames={{
                    label: [
                      'text-sm',
                      'text-stone-300',
                      'group-data-[filled-within=true]:text-primary-orange',
                    ],
                    input: ['font-base', 'text-md'],
                    inputWrapper: [
                      'group-data-[focus=true]:border-primary-orange',
                      'group-data-[hover=true]:border-primary-orange',
                    ],
                  }}
                  endContent={
                    <FaUserAlt
                      size={45}
                      className='flex items-center p-2 text-primary-orange'
                    />
                  }
                  {...field}
                />
              )}
            </Field>
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
                      'text-sm',
                      'text-stone-300',
                      'group-data-[filled-within=true]:text-primary-orange',
                    ],
                    input: ['font-base', 'text-md'],
                    inputWrapper: [
                      'group-data-[focus=true]:border-primary-orange',
                      'group-data-[hover=true]:border-primary-orange',
                    ],
                  }}
                  endContent={
                    <HiMail
                      size={45}
                      className='flex items-center p-2 text-primary-orange'
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
                  isInvalid={!!(meta.touched && meta.error)}
                  errorMessage={meta.touched && meta.error && meta.error}
                  classNames={{
                    label: [
                      'text-sm',
                      'text-stone-300',
                      'group-data-[filled-within=true]:text-primary-orange',
                    ],
                    input: ['font-base', 'text-md'],
                    inputWrapper: [
                      'group-data-[focus=true]:border-primary-orange',
                      'group-data-[hover=true]:border-primary-orange',
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
                          className='flex p-2 text-primary-orange'
                        />
                      ) : (
                        <AiFillEye
                          size={45}
                          className='flex p-2 text-primary-orange'
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
                      'group-data-[filled-within=true]:text-primary-orange',
                    ],
                    input: ['font-base', 'text-md'],
                    inputWrapper: [
                      'group-data-[focus=true]:border-primary-orange',
                      'group-data-[hover=true]:border-primary-orange',
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
                          className='flex p-2 text-primary-orange'
                        />
                      ) : (
                        <AiFillEye
                          size={45}
                          className='flex p-2 text-primary-orange'
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
              className='w-full bg-primary-orange py-6 rounded-xl text-center text-white text-lg font-semibold'
            >
              Зарегистрировать
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignUp
