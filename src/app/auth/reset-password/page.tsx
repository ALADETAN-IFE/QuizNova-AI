import { Suspense } from 'react'
import ResetPassword from './ResetPassword' // this is your component

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading error details...</div>}>
      <ResetPassword />
    </Suspense>
  )
}
