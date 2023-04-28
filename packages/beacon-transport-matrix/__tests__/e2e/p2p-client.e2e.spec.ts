import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import 'mocha'

import { P2PCommunicationClient } from '../../src'
import { getKeypairFromSeed } from '@exodus/airgap-beacon-utils'
import { LocalStorage } from '@exodus/airgap-beacon-core'
import { StorageKey } from '@exodus/airgap-beacon-types'

chai.use(chaiAsPromised)
const expect = chai.expect

const SEED = 'test'

describe(`P2PCommunicationClient e2e`, () => {
  let client: P2PCommunicationClient

  beforeEach(async () => {
    const keypair = await getKeypairFromSeed(SEED)
    const localStorage = new LocalStorage()

    client = new P2PCommunicationClient('Test', keypair, 2, localStorage, {})
  })

  it(`should start`, async () => {
    await client.start()
    const matrixSelectedNode = await client.storage.get(StorageKey.MATRIX_SELECTED_NODE)
    const { server } = await client.getRelayServer()
    expect(matrixSelectedNode).to.equal(server)
    await client.stop()
  })
})
