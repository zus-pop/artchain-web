import { LoginForm } from '@/components/login-form'
import AuthContainer from '@/components/AuthContainer'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-4xl">
        <AuthContainer />
      </div>
    </div>
  )
}

export default page