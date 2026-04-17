import React from 'react'
import { Button } from '@/components/ui/button'
import { requireAuth } from '@/module/auth/utils/auth-utils'
import Logout from '@/module/auth/components/logout'
const Home=async() => {
  await requireAuth()
  return (

    <div className='flex flex-col items-center justify-center h-screen'> 
      <Logout >
        <Button>Logout</Button>
        {/* <h2>hello</h2> */}
      </Logout>
    </div>
  )
}

export default Home
