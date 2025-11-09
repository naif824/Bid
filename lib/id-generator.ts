/**
 * Generate a random 6-character alphanumeric ID
 * Uses uppercase, lowercase letters and numbers
 * Example: aB3xY9
 */
export function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a unique short ID by checking against existing IDs
 */
export async function generateUniqueShortId(
  checkExists: (id: string) => Promise<boolean>
): Promise<string> {
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    const id = generateShortId()
    const exists = await checkExists(id)
    
    if (!exists) {
      return id
    }
    
    attempts++
  }
  
  // If we couldn't generate a unique ID after max attempts, throw error
  throw new Error('Could not generate unique short ID')
}
