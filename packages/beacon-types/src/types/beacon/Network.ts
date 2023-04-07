import { NetworkType } from '@exodus/airgap-beacon-types'

export interface Network {
  type: NetworkType
  name?: string
  rpcUrl?: string
}
