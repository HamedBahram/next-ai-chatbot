import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

export const runtime = 'edge'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse('Missing OpenAI API Key.', { status: 400 })
    }

    const { userId } = auth()
    if (!userId) {
      return new NextResponse('You need to sign in first.', { status: 401 })
    }

    const { messages } = await req.json()
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    return new NextResponse(error.message || 'Something went wrong!', {
      status: 500
    })
  }
}
