import { Suspense } from 'react'
import AuthError from './AuthError' // this is your component

export default function ErrorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading error details...</div>}>
      <AuthError />
    </Suspense>
  )
}
