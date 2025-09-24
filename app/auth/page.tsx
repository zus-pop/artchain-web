import { LoginForm } from '@/components/login-form'
import AuthContainer from '@/components/AuthContainer'
import React from 'react'

const page = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="max-w-sm md:max-w-6xl">
      <AuthContainer />
        {/* <LoginForm /> */}
      </div>
    </div>
  )
}

export default page