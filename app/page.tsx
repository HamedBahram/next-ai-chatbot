'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChat } from 'ai/react'
import { useEffect, useRef } from 'react'

export default function Chat() {
  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  useEffect(() => {
    if (ref.current === null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
    // ref.current.scrollTop = ref.current.scrollHeight
  }, [messages])

  return (
    <section>
      <h1>AI Chatbot</h1>
      <div className='container flex h-screen items-center justify-center'>
        <div className='w-full max-w-md'>
          <ScrollArea
            className='mb-2 h-[400px] rounded-md border p-4'
            ref={ref}
          >
            {messages.map(m => (
              <div key={m.id} className='whitespace-pre-wrap pr-10'>
                {m.role === 'user' ? (
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
                ) : (
                  <div className='mb-6 flex gap-3'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback className='bg-emerald-500 text-white'>
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className='mt-1.5'>
                      <p className='font-semibold'>Bot</p>
                      <div className='mt-1.5 text-sm text-zinc-500'>
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>

          <form onSubmit={handleSubmit}>
            <Input
              value={input}
              className='placeholder:italic placeholder:text-emerald-600/75'
              placeholder='Ask me anything...'
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </section>
  )
}
