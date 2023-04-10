import {
  P2PPairingRequest,
  ExtendedP2PPairingResponse,
  PostMessagePairingRequest,
  ExtendedPostMessagePairingResponse,
  WalletConnectPairingRequest,
  ExtendedWalletConnectPairingResponse
} from '@exodus/airgap-beacon-types'
import { toHex, getHexHash, sealCryptobox } from '@exodus/airgap-beacon-utils'
import { KeyPair } from '@stablelib/ed25519'
// @ts-ignore
import { convertPublicKeyToX25519, convertPrivateKeyToX25519 } from '@exodus/sodium-crypto'
import { blake2bInit, blake2bUpdate, blake2bFinal } from 'blakejs'
import * as nacl from "tweetnacl";

/**
 * @internalapi
 *
 *
 */
export abstract class CommunicationClient {
  constructor(protected readonly keyPair?: KeyPair) {}

  /**
   * Get the public key
   */
  public async getPublicKey(): Promise<string> {
    return toHex(this.keyPair?.publicKey)
  }

  /**
   * get the public key hash
   */
  public async getPublicKeyHash(): Promise<string> {
    return getHexHash(this.keyPair!.publicKey)
  }

  /**
   * Create a cryptobox server
   *
   * @param otherPublicKey
   * @param selfKeypair
   */
  protected async createCryptoBoxServer(
    otherPublicKey: string,
    selfKeypair: KeyPair
  ): Promise<{send: Uint8Array, receive: Uint8Array}> {
    // https://github.com/StableLib/stablelib/blob/a7bac13/packages/x25519-session/x25519-session.ts#L61
    const myPublicKey = await convertPublicKeyToX25519(selfKeypair.publicKey)
    const mySecretKey = await convertPrivateKeyToX25519(selfKeypair.secretKey)
    const theirPublicKey = await convertPublicKeyToX25519(Buffer.from(otherPublicKey, 'hex'))
    const sk = nacl.scalarMult(mySecretKey, theirPublicKey)
    const state = blake2bInit(64, undefined)
    blake2bUpdate(state, sk)
    blake2bUpdate(state, theirPublicKey)
    blake2bUpdate(state, myPublicKey)
    const h = blake2bFinal(state)
    return {
      send: h.subarray(0, 32),
      receive: h.subarray(32)
    }
  }

  /**
   * Create a cryptobox client
   *
   * @param otherPublicKey
   * @param selfKeypair
   */
  protected async createCryptoBoxClient(
    otherPublicKey: string,
    selfKeypair: KeyPair
  ): Promise<{send: Uint8Array, receive: Uint8Array}> {
    // https://github.com/ExodusMovement/exodus-mobile/pull/12437/files
    const myPublicKey = await convertPublicKeyToX25519(selfKeypair.publicKey)
    const mySecretKey = await convertPrivateKeyToX25519(selfKeypair.secretKey)
    const theirPublicKey = await convertPublicKeyToX25519(Buffer.from(otherPublicKey, 'hex'))
    const sk = nacl.scalarMult(mySecretKey, theirPublicKey)
    const state = blake2bInit(64, undefined)
    blake2bUpdate(state, sk)
    blake2bUpdate(state, myPublicKey)
    blake2bUpdate(state, theirPublicKey)
    const h = blake2bFinal(state)
    return {
      receive: h.subarray(0, 32),
      send: h.subarray(32)
    }
  }

  /**
   * Encrypt a message for a specific publicKey (receiver, asymmetric)
   *
   * @param recipientPublicKey
   * @param message
   */
  protected async encryptMessageAsymmetric(
    recipientPublicKey: string,
    message: string
  ): Promise<string> {
    return sealCryptobox(message, Buffer.from(recipientPublicKey, 'hex'))
  }

  abstract unsubscribeFromEncryptedMessages(): Promise<void>
  abstract unsubscribeFromEncryptedMessage(senderPublicKey: string): Promise<void>
  // abstract send(message: string, recipient?: string): Promise<void>
  public abstract sendMessage(
    message: string,
    peer?:
      | P2PPairingRequest
      | ExtendedP2PPairingResponse
      | PostMessagePairingRequest
      | ExtendedPostMessagePairingResponse
      | WalletConnectPairingRequest
      | ExtendedWalletConnectPairingResponse
  ): Promise<void>
}
