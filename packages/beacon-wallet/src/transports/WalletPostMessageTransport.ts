import { StorageKey, Storage, PostMessagePairingRequest } from '@exodus/airgap-beacon-types'
import { PostMessageTransport } from '@exodus/airgap-beacon-transport-postmessage'
import { KeyPair } from '@stablelib/ed25519'

// const logger = new Logger('WalletPostMessageTransport')

/**
 * @internalapi
 *
 *
 */
export class WalletPostMessageTransport extends PostMessageTransport<
  PostMessagePairingRequest,
  StorageKey.TRANSPORT_POSTMESSAGE_PEERS_WALLET
> {
  constructor(name: string, keyPair: KeyPair, storage: Storage) {
    super(name, keyPair, storage, StorageKey.TRANSPORT_POSTMESSAGE_PEERS_WALLET)
  }
}
