'use server'

import { clerkClient, currentUser } from '@clerk/nextjs'

export async function AddFreeCredits() {
  const user = await currentUser()

  if (!user) {
    return { success: false, error: 'You need to sign in first.' }
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 10
    }
  })

  return { success: true, error: null }
}
