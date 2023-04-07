import { BeaconBaseMessage, BeaconMessageType } from '@exodus/airgap-beacon-types'

/**
 * @category Message
 */
export interface DisconnectMessage extends BeaconBaseMessage {
  type: BeaconMessageType.Disconnect
}
