import { useSession, signOut } from 'next-auth/react'
import axios from 'axios'

export default async () => {
  const user = useSession().data.user
  await signOut({ redirect: false })
  await axios.post('/api/logout/', { user })
}
