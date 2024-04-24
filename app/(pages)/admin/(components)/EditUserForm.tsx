import { IOutputUser } from '@/app/(server)/schemas/user.schema'
import { trpc } from '@/app/(utils)/trpc/trpc'
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react'
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FcCancel } from 'react-icons/fc'
import { MdEdit, MdOutlineSyncLock } from 'react-icons/md'
import * as Yup from 'yup'

interface IEditUserFormProps {
  user: IOutputUser
}

const EditUserForm = ({ user }: IEditUserFormProps) => {
  const router = useRouter()
  const { data: dataCdrs } = trpc.getListCdr.useQuery(undefined)
  const operators = React.useMemo(() => {
    const operators = dataCdrs?.map(cdr => cdr.src).flat() || []
    return _.uniq(operators)
  }, [dataCdrs])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isVisiblePassword, setIsVisiblePassword] = React.useState(false)
  const [valuesOperators, setValuesOperators] = React.useState(
    new Set(user.operators!.split(' ')),
  )
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

  const handleSelectionChange = (e: any) => {
    setValuesOperators(new Set(e.target.value.split(',')))
  }

  const toggleVisibilityPassword = () =>
    setIsVisiblePassword(!isVisiblePassword)

  const updateUser = trpc.updateUser.useMutation({
    onSettled: () => {},
    onSuccess: () => {
      toast.success(`User c логином ${user.login} обновлен!`, {
        style: {
          borderRadius: '10px',
          background: 'grey',
          color: '#fff',
        },
      })
      onOpenChange()
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
    setSubmitting(true)
    const userData = {
      id: user.id,
      name: values.name,
      login: values.login,
      operators: Array.from(valuesOperators).join(' '),
      role: 'user',
    }
    const updatePassword = values.updatePassword
      ? { password: values.password }
      : {}
    await updateUser.mutateAsync({ ...userData, ...updatePassword })
    setSubmitting(false)
  }
  return (
    <>
      <Button
        onPress={() => {
          setValuesOperators(new Set(user.operators!.split(' ')))
          onOpen()
        }}
        isIconOnly
      >
        <MdEdit size='1.5rem' />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <Formik
          initialValues={{
            name: user.name,
            login: user.login,
            password: '',
            updatePassword: false,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, 'Минимальное имя состоит из 3 символов')
              .required('Введите имя'),
            login: Yup.string()
              .min(3, 'Минимальный логин состоит из 3 символов')
              .required('Введите логин'),
            updatePassword: Yup.boolean(),
            password: Yup.string().when(
              'updatePassword',
              ([updatePassword], schema) => {
                if (updatePassword)
                  return schema
                    .min(6, 'Минимальное количество символов 6')
                    .required('Пожалуйста, введите пароль')
                return schema
              },
            ),
          })}
          onSubmit={handleSubmit}
        >
          {(props: FormikProps<any>) => (
            <Form
              onSubmit={props.handleSubmit}
              className='flex flex-col gap-4 items-center justify-center text-white'
            >
              <ModalContent>
                {onClose => (
                  <>
                    <ModalHeader className='flex flex-col gap-1 text-black'>
                      Редактирование Пользователя
                    </ModalHeader>
                    <ModalBody className='pb-6'>
                      <Field name='name'>
                        {({ meta, field }: any) => (
                          <Input
                            type='text'
                            label='Имя'
                            labelPlacement='inside'
                            variant='bordered'
                            isInvalid={!!(meta.touched && meta.error)}
                            errorMessage={
                              meta.touched && meta.error && meta.error
                            }
                            classNames={{
                              label: ['font-base', 'text-md', 'text-black'],
                              input: ['font-base', 'text-md', 'text-black'],
                              inputWrapper: ['bg-white'],
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
                            variant='bordered'
                            isInvalid={!!(meta.touched && meta.error)}
                            errorMessage={
                              meta.touched && meta.error && meta.error
                            }
                            classNames={{
                              label: ['font-base', 'text-md', 'text-black'],
                              input: ['font-base', 'text-md', 'text-black'],
                              inputWrapper: ['bg-white'],
                            }}
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
                              className='w-full'
                              selectedKeys={valuesOperators}
                              onChange={handleSelectionChange}
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
                      <Accordion
                        selectedKeys={selectedKeys}
                        onSelectionChange={(e: any) => {
                          setSelectedKeys(e)
                          props.setFieldValue(
                            'updatePassword',
                            !props.values.updatePassword,
                          )
                        }}
                      >
                        <AccordionItem
                          key='1'
                          aria-label='Password'
                          indicator={({ isOpen }) =>
                            isOpen ? <FcCancel /> : <MdOutlineSyncLock />
                          }
                          title='Обновить пароль?'
                          classNames={{ title: 'text-blue-500' }}
                        >
                          <Field name='password'>
                            {({ meta, field }: any) => (
                              <Input
                                type={isVisiblePassword ? 'text' : 'password'}
                                variant='bordered'
                                isInvalid={!!(meta.touched && meta.error)}
                                errorMessage={
                                  meta.touched && meta.error && meta.error
                                }
                                label='Введите пароль'
                                labelPlacement='inside'
                                classNames={{
                                  label: ['font-base', 'text-md', 'text-black'],
                                  input: ['font-base', 'text-md', 'text-black'],
                                  inputWrapper: ['bg-white'],
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
                                        className='flex p-2'
                                      />
                                    ) : (
                                      <AiFillEye
                                        size={45}
                                        className='flex p-2'
                                      />
                                    )}
                                  </button>
                                }
                                {...field}
                              />
                            )}
                          </Field>
                        </AccordionItem>
                      </Accordion>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color='danger'
                        variant='flat'
                        onPress={onClose}
                        className='rounded-xl'
                      >
                        Отменить
                      </Button>
                      <Button
                        color='success'
                        type='submit'
                        disabled={!props.isValid}
                        isLoading={props.isSubmitting}
                        className='rounded-xl text-white'
                      >
                        Сохранить
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  )
}

export default EditUserForm
