import { Transport } from '@exodus/airgap-beacon-core'

export class MockTransport extends Transport {
  public async listen() {}
}
