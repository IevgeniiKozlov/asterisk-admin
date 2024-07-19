'use client'

import { Button, Image, Input } from '@nextui-org/react'
import type { FormikHelpers, FormikProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import NextImage from 'next/image'
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
    <div className='w-[400px] flex flex-col items-center justify-center gap-8 sm:shadow-xl px-8 py-8 pt-12 bg-white rounded-[40px] z-20'>
      <AnimatePresence>
        <Image
          as={NextImage}
          src='/Asterisk_logo.png'
          width={200}
          height={100}
          alt='asterisk info'
        />
        <h3 className='mb-4 text-center text-2xl font-semibold text-stone-500'>
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
                        'text-sm',
                        'text-stone-300',
                        'group-data-[filled-within=true]:text-primary-orange',
                      ],
                      input: ['text-black', 'text-sm'],
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
                    variant='bordered'
                    isInvalid={!!(meta.touched && meta.error)}
                    errorMessage={meta.touched && meta.error && meta.error}
                    label='Введите пароль'
                    labelPlacement='inside'
                    classNames={{
                      label: [
                        'text-sm',
                        'text-stone-300',
                        'group-data-[filled-within=true]:text-primary-orange',
                      ],
                      input: ['text-black', 'text-sm'],
                      inputWrapper: [
                        'group-data-[focus=true]:border-primary-orange',
                        'group-data-[hover=true]:border-primary-orange',
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
                className='w-full bg-primary-orange py-6 rounded-xl text-center text-white text-xl font-semibold'
              >
                Войти
                <FiLogIn className='text-xl' />
              </Button>
            </Form>
          )}
        </Formik>
      </AnimatePresence>
    </div>
  )
}

export default SignIn
