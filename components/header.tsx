import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Header() {
  return (
    <header className='py-6'>
      <div className='container flex max-w-3xl items-center justify-between'>
        <Link href='/'>chat.ai</Link>

        <SignedIn>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>

        <SignedOut>
          <SignInButton mode='modal'>
            <Button size='sm' variant='outline'>
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}
