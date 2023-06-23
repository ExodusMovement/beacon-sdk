import { blake2b } from '@exodus/blakejs'
import * as bs58check from 'bs58check'

/**
 * @internalapi
 *
 * Generate a deterministic sender identifier based on a public key
 *
 * @param publicKey
 */
export const getSenderId = async (publicKey: string): Promise<string> => {
  const data = Buffer.from(publicKey, 'hex')
  if (data.length !== 32) {
    throw new Error('getSenderId: invalid public key length')
  }
  const buffer = Buffer.from(blake2b(data, undefined, 5))

  return bs58check.encode(buffer)
}
