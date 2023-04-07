import { BeaconBaseMessage, BeaconMessageType } from '@exodus/airgap-beacon-types'

/**
 * @category Message
 */
export interface AcknowledgeResponse extends BeaconBaseMessage {
  type: BeaconMessageType.Acknowledge
}
