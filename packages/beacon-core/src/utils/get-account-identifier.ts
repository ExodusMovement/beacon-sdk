import * as bs58check from 'bs58check'
import { Network } from '@exodus/airgap-beacon-types'
import { blake2b } from '@exodus/blakejs'
import { encode } from '@stablelib/utf8'

/**
 * @internalapi
 *
 * Generate a deterministic account identifier based on an address and a network
 *
 * @param address
 * @param network
 */
export const getAccountIdentifier = async (address: string, network: Network): Promise<string> => {
  const data: string[] = [address, network.type]
  if (network.name) {
    data.push(`name:${network.name}`)
  }
  if (network.rpcUrl) {
    data.push(`rpc:${network.rpcUrl}`)
  }

  const buffer = Buffer.from(blake2b(encode(data.join('-')), undefined, 16))

  return bs58check.encode(buffer)
}
