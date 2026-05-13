import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
      <SignUp />
    </main>
  )
}