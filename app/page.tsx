
import { requireAuth } from '@/module/auth/utils/auth-utils'
import { redirect } from 'next/navigation'


const Home=async() => {
  await requireAuth()
  return redirect('/dashboard')
}

export default Home
