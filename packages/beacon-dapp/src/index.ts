export * from '@exodus/airgap-beacon-core'
export * from '@exodus/airgap-beacon-transport-matrix'
export * from '@exodus/airgap-beacon-transport-postmessage'
export * from '@exodus/airgap-beacon-types'
export * from '@exodus/airgap-beacon-utils'
export * from '@exodus/airgap-beacon-ui'

import { DAppClient } from './dapp-client/DAppClient'
import { DAppClientOptions } from './dapp-client/DAppClientOptions'
import { BeaconEvent, BeaconEventHandler, defaultEventCallbacks } from './events'
import { BlockExplorer } from './utils/block-explorer'
import { TzktBlockExplorer } from './utils/tzkt-blockexplorer'
import { getDAppClientInstance } from './utils/get-instance'

export { DAppClient, DAppClientOptions, getDAppClientInstance }

// Events
export { BeaconEvent, BeaconEventHandler, defaultEventCallbacks }

// BlockExplorer
export { BlockExplorer, TzktBlockExplorer, TzktBlockExplorer as TezblockBlockExplorer }
