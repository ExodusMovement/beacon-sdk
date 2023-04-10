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
  const buffer = Buffer.from(blake2b(Buffer.from(publicKey, 'hex'), undefined, 5))

  return bs58check.encode(buffer)
}
