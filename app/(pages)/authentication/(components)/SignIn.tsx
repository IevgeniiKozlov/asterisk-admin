'use client'

import { Button, Input } from '@nextui-org/react'
import type { FormikHelpers, FormikProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FiLogIn } from 'react-icons/fi'
import { HiMail } from 'react-icons/hi'
import { object, string } from 'yup'

const SignIn = () => {
  const router = useRouter()
  const [isVisiblePassword, setIsVisiblePassword] = useState(false)
  const toggleVisibilityPassword = () =>
    setIsVisiblePassword(!isVisiblePassword)

  const handleSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>,
  ) => {
    setSubmitting(true)
    try {
      const res = await signIn('user', {
        login: values.login,
        password: values.password,
        role: 'user',
        redirect: false,
        callbackUrl: '/',
      })
      if (res && !res.error) {
        toast.success('Приветствуем в личном кабинете!', {
          style: {
            borderRadius: '10px',
            background: 'grey',
            color: '#fff',
          },
        })
        router.push('/')
        router.refresh()
      } else {
        throw new Error(
          'Ошибка авторизации, проверьте правильность ввода логина и пароля',
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

  return (
    <div className='flex flex-col items-center justify-center gap-8 p-10 sm:shadow-xl px-8 py-8 pt-12 sm:bg-white rounded-xl bg-white'>
      <h3 className='mb-4 text-center text-2xl font-semibold'>
        Вход в кабинет
      </h3>
      <Formik
        initialValues={{ login: '', password: '' }}
        validationSchema={object().shape({
          login: string().required('Введите Ваш логин'),
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
                  type='text'
                  variant='bordered'
                  label='Введите логин'
                  labelPlacement='inside'
                  isInvalid={!!(meta.touched && meta.error)}
                  errorMessage={meta.touched && meta.error && meta.error}
                  classNames={{
                    label: [
                      'font-base',
                      'text-md',
                      'group-data-[filled-within=true]:text-mid-blue',
                    ],
                    input: ['font-base', 'text-md'],
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
                      'group-data-[filled-within=true]:text-mid-blue',
                    ],
                    input: ['font-base', 'text-md'],
                    inputWrapper: ['group-data-[focus=true]:border-mid-green'],
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
              className='w-full py-6 rounded-xl text-center text-xl font-bold'
            >
              Войти
              <FiLogIn className='text-xl' />
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignIn
