'use client'

import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import CopyToClipboard from '@/components/copy-to-clipboard'
import SubscriptionDialog from '@/components/subscription-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { SendHorizontalIcon, Zap } from 'lucide-react'
import { useClerk, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { AddFreeCredits } from '@/lib/actions'

export default function Chat() {
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)

  const { isLoaded, isSignedIn, user } = useUser()
  const { openSignIn, session } = useClerk()

  const credits = user?.publicMetadata?.credits
  const newUser = typeof credits === 'undefined'
  const paidUser = user?.publicMetadata?.stripeCustomerId

  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: 'system',
          content: 'You are an assistant that gives short answers.'
        }
      ],
      onResponse: response => {
        if (!response.ok) {
          const status = response.status

          switch (status) {
            case 401:
              openSignIn()
              break
            case 402:
              toast.error('You have no credits left.', {
                action: {
                  label: 'Get more',
                  onClick: () => setSubscriptionDialogOpen(true)
                }
              })
              break
            default:
              toast.error(error?.message || 'Something went wrong!')
              break
          }
        }
        session?.reload()
      }
    })

  useEffect(() => {
    if (ref.current === null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
  }, [messages])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isSignedIn) {
      handleSubmit(e)
    } else {
      openSignIn()
    }
  }

  async function handleClick() {
    const { success, error } = await AddFreeCredits()

    if (error) {
      toast.error(error)
      return
    }

    toast.success('10 credits added successfully.')
    session?.reload()
  }

  return (
    <section className='py-24 text-zinc-700'>
      <div className='container max-w-3xl'>
        {/* Credits section */}
        <div className='mx-auto flex max-w-lg items-center justify-between px-1'>
          <h1 className='font-serif text-2xl font-medium'>AI Chatbot</h1>

          <div>
            {isSignedIn && newUser && (
              <Button
                size='sm'
                variant='outline'
                className='border-emerald-500'
                onClick={handleClick}
              >
                Redeem 10 Free Credits
              </Button>
            )}
            {isSignedIn && typeof credits === 'number' && (
              <div className='flex items-center gap-2'>
                <Zap className='h-5 w-5 text-emerald-500' />
                <span className='text-sm text-zinc-500'>Credits:</span>
                <span className='font-medium'>{credits}</span>
              </div>
            )}
          </div>

          {isSignedIn && !paidUser && !newUser && (
            <Button
              size='sm'
              variant='secondary'
              onClick={() => setSubscriptionDialogOpen(true)}
            >
              Get more credits
            </Button>
          )}
        </div>

        {/* Chat area */}
        <div className='mx-auto mt-3 w-full max-w-lg'>
          <ScrollArea
            className='mb-2 h-[400px] rounded-md border p-4'
            ref={ref}
          >
            {messages.map(m => (
              <div key={m.id} className='mr-6 whitespace-pre-wrap md:mr-12'>
                {m.role === 'user' && (
                  <div className='mb-6 flex gap-3'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback className='text-sm'>U</AvatarFallback>
                    </Avatar>
                    <div className='mt-1.5'>
                      <p className='font-semibold'>You</p>
                      <div className='mt-1.5 text-sm text-zinc-500'>
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}

                {m.role === 'assistant' && (
                  <div className='mb-6 flex gap-3'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback className='bg-emerald-500 text-white'>
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className='mt-1.5 w-full'>
                      <div className='flex justify-between'>
                        <p className='font-semibold'>Bot</p>
                        <CopyToClipboard message={m} className='-mt-1' />
                      </div>
                      <div className='mt-2 text-sm text-zinc-500'>
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>

          <form onSubmit={onSubmit} className='relative'>
            <Input
              name='message'
              value={input}
              onChange={handleInputChange}
              placeholder={
                isSignedIn ? 'Ask me anything...' : 'Sign in to start...'
              }
              className='pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500'
            />
            <Button
              size='icon'
              type='submit'
              variant='secondary'
              disabled={isLoading || !isLoaded}
              className='absolute right-1 top-1 h-8 w-10'
            >
              <SendHorizontalIcon className='h-5 w-5 text-emerald-500' />
            </Button>
          </form>
        </div>

        {/* Subscription dialog */}
        <SubscriptionDialog
          open={subscriptionDialogOpen}
          onOpenChange={setSubscriptionDialogOpen}
        />
      </div>
    </section>
  )
}
