import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
      <SignIn />
    </main>
  )
}