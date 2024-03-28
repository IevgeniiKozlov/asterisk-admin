import { ILoginAdmin, ILoginUser, ISignUpAdmin } from '../schemas/auth.schema'
import { createUser, validateAdmin, validateUser } from './user.service'

export const loginAdmin = async (data: ILoginAdmin) => {
  return await validateAdmin(data)
}

export const loginUser = async (data: ILoginUser) => {
  return await validateUser(data)
}

export const signUpAdmin = async (data: ISignUpAdmin) => {
  return await createUser(data)
}
