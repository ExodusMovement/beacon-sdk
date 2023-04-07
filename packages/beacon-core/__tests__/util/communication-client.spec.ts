import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import 'mocha'
import { CommunicationClient } from '../../src'
import { getKeypairFromSeed, toHex } from '@exodus/airgap-beacon-utils'
import { KeyPair } from '@stablelib/ed25519'
import { SessionKeys } from '@stablelib/x25519-session'

// use chai-as-promised plugin
chai.use(chaiAsPromised)
const expect = chai.expect

class CommunicationClientExtended extends CommunicationClient {
  public async pubCreateCryptoBoxServer(
    otherPublicKey: string,
    selfKeypair: KeyPair
  ): Promise<SessionKeys> {
    return this.createCryptoBoxServer(otherPublicKey, selfKeypair)
  }
  public async pubCreateCryptoBoxClient(
    otherPublicKey: string,
    selfKeypair: KeyPair
  ): Promise<SessionKeys> {
    return this.createCryptoBoxClient(otherPublicKey, selfKeypair)
  }
  public async unsubscribeFromEncryptedMessages(){ throw new Error('not implemented') }
  public async unsubscribeFromEncryptedMessage(){ throw new Error('not implemented') }
  public async sendMessage(){ throw new Error('not implemented') }
}

function expectEqualBytes(a: Uint8Array, b: Uint8Array) {
  expect(new Array(a)).to.deep.equal(new Array(b))
}

describe(`CommunicationClient`, () => {
  describe('key exchange', () => {
    it(`should derive the same keys in server and client`, async () => {
      const client = new CommunicationClientExtended()
      const serverKp = await getKeypairFromSeed('server')
      const clientKp = await getKeypairFromSeed('client')
      const serverSessionKeys = await client.pubCreateCryptoBoxServer(toHex(clientKp.publicKey), serverKp)
      const clientSessionKeys = await client.pubCreateCryptoBoxClient(toHex(serverKp.publicKey), clientKp)
      console.log(serverSessionKeys.receive)
      console.log(clientSessionKeys.send)
      expectEqualBytes(serverSessionKeys.receive, clientSessionKeys.send)
      expectEqualBytes(serverSessionKeys.send, clientSessionKeys.receive)
    })
  })
})
