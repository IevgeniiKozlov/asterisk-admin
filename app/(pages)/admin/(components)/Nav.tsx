import { auth } from '@/app/(utils)/next-auth/auth'
import Navbar from './NavBar'

export default async function Nav() {
  const session = await auth()
  return <Navbar user={session?.user} />
}
