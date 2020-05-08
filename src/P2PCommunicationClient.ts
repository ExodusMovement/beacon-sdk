import * as sodium from 'libsodium-wrappers'

import {
  getHexHash,
  toHex,
  sealCryptobox,
  recipientString,
  openCryptobox,
  encryptCryptoboxPayload,
  decryptCryptoboxPayload
} from './utils/crypto'
import { MatrixClient } from './clients/matrix-client/MatrixClient'
import {
  MatrixClientEvent,
  MatrixClientEventType,
  MatrixClientEventMessageContent
} from './clients/matrix-client/models/MatrixClientEvent'
import { MatrixMessageType } from './clients/matrix-client/models/MatrixMessage'
import { MatrixRoom } from './clients/matrix-client/models/MatrixRoom'

export class P2PCommunicationClient {
  private readonly clients: MatrixClient[] = []

  private readonly KNOWN_RELAY_SERVERS = [
    'matrix.papers.tech'
    // 'matrix.tez.ie',
    // 'matrix-dev.papers.tech',
    // "matrix.stove-labs.com",
    // "yadayada.cryptonomic-infra.tech"
  ]

  private readonly activeListeners: Map<string, (event: MatrixClientEvent<any>) => void> = new Map()

  constructor(
    private readonly name: string,
    private readonly keyPair: sodium.KeyPair,
    public readonly replicationCount: number,
    private readonly debug: boolean = false
  ) {}

  public getHandshakeInfo(): { name: string; pubKey: string; relayServer: string } {
    return {
      name: this.name,
      pubKey: this.getPublicKey(),
      relayServer: this.getRelayServer()
    }
  }

  public getRelayServer(publicKeyHash?: string, nonce: string = ''): string {
    if (!this.keyPair) {
      throw new Error('KeyPair not available')
    }
    const hash: string = publicKeyHash || getHexHash(this.keyPair.publicKey)

    return this.KNOWN_RELAY_SERVERS.reduce((prev, curr) => {
      const prevRelayServerHash = getHexHash(prev + nonce)
      const currRelayServerHash = getHexHash(curr + nonce)

      return this.getAbsoluteBigIntDifference(hash, prevRelayServerHash) <
        this.getAbsoluteBigIntDifference(hash, currRelayServerHash)
        ? prev
        : curr
    })
  }

  public async start(): Promise<void> {
    this.log('starting client')
    await sodium.ready

    const loginRawDigest = sodium.crypto_generichash(
      32,
      sodium.from_string(`login:${Math.floor(Date.now() / 1000 / (5 * 60))}`)
    )
    const rawSignature = sodium.crypto_sign_detached(loginRawDigest, this.keyPair.privateKey)

    this.log(`connecting to ${this.replicationCount} servers`)

    for (let i = 0; i < this.replicationCount; i++) {
      // TODO: Parallel
      const client = MatrixClient.create({
        baseUrl: `https://${this.getRelayServer(this.getPublicKeyHash(), i.toString())}`
      })

      client.subscribe(MatrixClientEventType.INVITE, async (event) => {
        await client.joinRooms(event.content.roomId)
      })

      this.log(
        'login',
        this.getPublicKeyHash(),
        'on',
        this.getRelayServer(this.getPublicKeyHash(), i.toString())
      )

      await client.start({
        id: this.getPublicKeyHash(),
        password: `ed:${toHex(rawSignature)}:${this.getPublicKey()}`,
        deviceId: toHex(this.keyPair.publicKey)
      })

      await client.joinRooms(...client.invitedRooms)

      this.clients.push(client)
    }
  }

  public async listenForEncryptedMessage(
    senderPublicKey: string,
    messageCallback: (message: string) => void
  ): Promise<void> {
    if (!this.keyPair) {
      throw new Error('KeyPair not available')
    }

    const { sharedRx } = await this.createCryptoBoxServer(senderPublicKey, this.keyPair.privateKey)

    if (this.activeListeners.has(senderPublicKey)) {
      return
    }

    const callbackFunction = (event: MatrixClientEvent<MatrixClientEventType.MESSAGE>): void => {
      if (this.isTextMessage(event.content) && this.isSender(event, senderPublicKey)) {
        const payload = Buffer.from(event.content.message.content, 'hex')
        if (
          payload.length >=
          sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
        ) {
          messageCallback(decryptCryptoboxPayload(payload, sharedRx))
        }
      }
    }

    this.activeListeners.set(senderPublicKey, callbackFunction)

    for (const client of this.clients) {
      client.subscribe(MatrixClientEventType.MESSAGE, callbackFunction)
    }
  }

  public async unsubscribeFromEncryptedMessage(senderPublicKey: string): Promise<void> {
    const listener = this.activeListeners.get(senderPublicKey)
    if (!listener) {
      return
    }

    for (const client of this.clients) {
      client.unsubscribe(MatrixClientEventType.MESSAGE, listener)
    }

    this.activeListeners.delete(senderPublicKey)
  }

  public async unsubscribeFromEncryptedMessages(): Promise<void> {
    for (const client of this.clients) {
      client.unsubscribe(MatrixClientEventType.MESSAGE)
    }

    this.activeListeners.clear()
  }

  public async sendMessage(recipientPublicKey: string, message: string): Promise<void> {
    if (!this.keyPair) {
      throw new Error('KeyPair not available')
    }
    const { sharedTx } = await this.createCryptoBoxClient(
      recipientPublicKey,
      this.keyPair.privateKey
    )

    for (let i = 0; i < this.replicationCount; i++) {
      const recipientHash = getHexHash(Buffer.from(recipientPublicKey, 'hex'))
      const recipient = recipientString(
        recipientHash,
        this.getRelayServer(recipientHash, i.toString())
      )

      for (const client of this.clients) {
        const room = await this.getRelevantRoom(client, recipient)

        client.sendTextMessage(room.id, encryptCryptoboxPayload(message, sharedTx))
      }
    }
  }

  public async listenForChannelOpening(messageCallback: (message: string) => void): Promise<void> {
    for (const client of this.clients) {
      client.subscribe(MatrixClientEventType.MESSAGE, (event) => {
        console.log('channel opening', event)
        if (this.isTextMessage(event.content) && this.isChannelOpenMessage(event.content)) {
          if (!this.keyPair) {
            throw new Error('KeyPair not available')
          }
          this.log('new channel open event!')

          const splits = event.content.message.content.split(':')
          const payload = Buffer.from(splits[splits.length - 1], 'hex')

          if (
            payload.length >=
            sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
          ) {
            messageCallback(openCryptobox(payload, this.keyPair.publicKey, this.keyPair.privateKey))
          }
        }
      })
    }
  }

  public async openChannel(recipientPublicKey: string, relayServer: string): Promise<void> {
    this.log('open channel')
    const recipientHash = getHexHash(Buffer.from(recipientPublicKey, 'hex'))
    const recipient = recipientString(recipientHash, relayServer)

    this.log(`currently there are ${this.clients.length} clients open`)
    for (const client of this.clients) {
      const room = await this.getRelevantRoom(client, recipient)

      const encryptedMessage = sealCryptobox(
        this.getPublicKey(),
        Buffer.from(recipientPublicKey, 'hex')
      )
      client.sendTextMessage(room.id, ['@channel-open', recipient, encryptedMessage].join(':'))
    }
  }

  public isTextMessage(
    content: MatrixClientEventMessageContent<any>
  ): content is MatrixClientEventMessageContent<string> {
    return content.message.type === MatrixMessageType.TEXT
  }

  public isChannelOpenMessage(content: MatrixClientEventMessageContent<string>): boolean {
    return content.message.content.startsWith(
      `@channel-open:@${getHexHash(Buffer.from(this.getPublicKey(), 'hex'))}`
    )
  }

  public isSender(
    event: MatrixClientEvent<MatrixClientEventType.MESSAGE>,
    senderPublicKey: string
  ): boolean {
    return event.content.message.sender.startsWith(
      `@${getHexHash(Buffer.from(senderPublicKey, 'hex'))}`
    )
  }

  public getPublicKey(): string {
    if (!this.keyPair) {
      throw new Error('KeyPair not available')
    }

    return toHex(this.keyPair.publicKey)
  }

  public getPublicKeyHash(): string {
    if (!this.keyPair) {
      throw new Error('KeyPair not available')
    }

    return getHexHash(this.keyPair.publicKey)
  }

  private bigIntAbsolute(inputBigInt: bigint): bigint {
    if (inputBigInt < BigInt(0)) {
      return inputBigInt * BigInt(-1)
    } else {
      return inputBigInt
    }
  }

  private getAbsoluteBigIntDifference(firstHash: string, secondHash: string): bigint {
    const difference = BigInt(`0x${firstHash}`) - BigInt(`0x${secondHash}`)

    return this.bigIntAbsolute(difference)
  }

  private async createCryptoBox(
    otherPublicKey: string,
    selfPrivateKey: Uint8Array
  ): Promise<[Uint8Array, Uint8Array, Uint8Array]> {
    // TODO: Don't calculate it every time?
    const kxSelfPrivateKey = sodium.crypto_sign_ed25519_sk_to_curve25519(
      Buffer.from(selfPrivateKey)
    ) // Secret bytes to scalar bytes
    const kxSelfPublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(
      Buffer.from(selfPrivateKey).slice(32, 64)
    ) // Secret bytes to scalar bytes
    const kxOtherPublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(
      Buffer.from(otherPublicKey, 'hex')
    ) // Secret bytes to scalar bytes

    return [
      Buffer.from(kxSelfPublicKey),
      Buffer.from(kxSelfPrivateKey),
      Buffer.from(kxOtherPublicKey)
    ]
  }

  private async createCryptoBoxServer(
    otherPublicKey: string,
    selfPrivateKey: Uint8Array
  ): Promise<sodium.CryptoKX> {
    const keys = await this.createCryptoBox(otherPublicKey, selfPrivateKey)

    return sodium.crypto_kx_server_session_keys(...keys)
  }

  private async createCryptoBoxClient(
    otherPublicKey: string,
    selfPrivateKey: Uint8Array
  ): Promise<sodium.CryptoKX> {
    const keys = await this.createCryptoBox(otherPublicKey, selfPrivateKey)

    return sodium.crypto_kx_client_session_keys(...keys)
  }

  private async getRelevantRoom(client: MatrixClient, recipient: string): Promise<MatrixRoom> {
    const joinedRooms = client.joinedRooms
    const relevantRooms = joinedRooms.filter((room: MatrixRoom) =>
      room.members.some((member: string) => member === recipient)
    )

    let room: MatrixRoom
    if (relevantRooms.length === 0) {
      this.log(`no relevant rooms found`)

      const roomId = await client.createTrustedPrivateRoom(recipient)
      room = client.getRoomById(roomId)
    } else {
      room = relevantRooms[0]
      this.log(`channel already open, reusing room ${room.id}`)
    }

    return room
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log(`--- [P2PCommunicationClient]:${this.name}: `, ...args)
    }
  }
}
