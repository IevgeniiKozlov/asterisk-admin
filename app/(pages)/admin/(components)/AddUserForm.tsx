'use client'

import { trpc } from '@/app/(utils)/trpc/trpc'
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { AiFillEye, AiFillEyeInvisible, AiOutlineUserAdd } from 'react-icons/ai'
import { IoMdAdd } from 'react-icons/io'
import * as Yup from 'yup'

const AddUserForm = ({ operators }: { operators: string[] }) => {
  const router = useRouter()
  const [isVisiblePassword, setIsVisiblePassword] = React.useState(false)
  const [valuesOperators, setValuesOperators] = React.useState(new Set([]))

  const handleSelectionChange = (e: any) => {
    setValuesOperators(new Set(e.target.value.split(',')))
  }
  const toggleVisibilityPassword = () =>
    setIsVisiblePassword(!isVisiblePassword)

  const registerUser = trpc.registerUser.useMutation({
    onSuccess: () => {
      toast.success('Пользователь успешно создан', {
        style: {
          borderRadius: '10px',
          background: 'grey',
          color: '#fff',
        },
      })
      router.refresh()
    },
    onError: (error: any) => {
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
    values: any,
    { setSubmitting, resetForm }: FormikHelpers<any>,
  ) => {
    const operators = Array.from(valuesOperators).join(' ')

    try {
      await registerUser.mutateAsync({ ...values, operators, role: 'user' })
      resetForm()
    } catch (error: any) {
      return error
    }
  }

  return (
    <Accordion variant='splitted' className='px-0'>
      <AccordionItem
        key='1'
        startContent={<IoMdAdd size={25} />}
        aria-label='Create new user'
        title={<span>Добавить нового пользователя</span>}
        className='[&>section]:my-3 !shadow-small'
      >
        <Formik
          initialValues={{
            name: '',
            login: '',
            password: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, 'Минимальное имя состоит из 3 символов')
              .required('Введите имя'),
            login: Yup.string()
              .min(3, 'Минимальный логин состоит из 3 символов')
              .required('Введите логин'),
            password: Yup.string()
              .min(6, 'Минимальное количество символов 6')
              .required('Введите пароль'),
          })}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<any>) => (
            <Form
              onSubmit={props.handleSubmit}
              className='flex flex-col lg:flex-row items-center content-center justify-center gap-5 text-white'
            >
              <Field name='name'>
                {({ meta, field }: any) => (
                  <Input
                    type='text'
                    label='Имя'
                    labelPlacement='inside'
                    size='sm'
                    variant='bordered'
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
                    {...field}
                  />
                )}
              </Field>
              <Field name='login'>
                {({ meta, field }: any) => (
                  <Input
                    type='text'
                    label='Логин'
                    labelPlacement='inside'
                    size='sm'
                    variant='bordered'
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
                    size='sm'
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
                        className='focus:outline-none text-black'
                        type='button'
                        onClick={toggleVisibilityPassword}
                      >
                        {isVisiblePassword ? (
                          <AiFillEyeInvisible
                            size={45}
                            className='flex p-2 text-stone-300'
                          />
                        ) : (
                          <AiFillEye
                            size={45}
                            className='flex p-2 text-stone-400'
                          />
                        )}
                      </button>
                    }
                    {...field}
                  />
                )}
              </Field>
              <Field name='operators'>
                {({ meta, field }: any) => {
                  return (
                    <Select
                      label='Операторы'
                      selectionMode='multiple'
                      className='max-w-xs'
                      size='sm'
                      selectedKeys={valuesOperators}
                      onChange={handleSelectionChange}
                      classNames={{
                        selectorIcon: ['text-black'],
                      }}
                    >
                      {operators.map((operator: string) => (
                        <SelectItem key={operator} value={operator}>
                          {operator}
                        </SelectItem>
                      ))}
                    </Select>
                  )
                }}
              </Field>
              <Button
                type='submit'
                disabled={!props.isValid}
                isLoading={props.isSubmitting}
                isIconOnly
                className='bg-[#ECBC76]'
              >
                <AiOutlineUserAdd size={90} className='flex p-2' />
              </Button>
            </Form>
          )}
        </Formik>
      </AccordionItem>
    </Accordion>
  )
}

export default AddUserForm
