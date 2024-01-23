'use client'

import { cn } from '@/lib/utils'
import { type Message } from 'ai'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

import { Button } from '@/components/ui/button'
import { CheckIcon, CopyIcon } from 'lucide-react'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

export default function CopyToClipboard({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  return (
    <div className={cn('', className)} {...props}>
      <Button
        variant='secondary'
        size='icon'
        className='h-8 w-8'
        onClick={onCopy}
      >
        {isCopied ? (
          <CheckIcon className='h-4 w-4 text-emerald-500' />
        ) : (
          <CopyIcon className='h-4 w-4 text-zinc-500' />
        )}
        <span className='sr-only'>Copy message</span>
      </Button>
    </div>
  )
}
