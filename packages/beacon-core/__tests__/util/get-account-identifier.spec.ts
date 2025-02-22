import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import 'mocha'
import { getAccountIdentifier } from '../../src/utils/get-account-identifier'
import { Network, NetworkType } from '@exodus/airgap-beacon-types'

// use chai-as-promised plugin
chai.use(chaiAsPromised)
const expect = chai.expect

describe(`AccountIdentifier`, () => {
  describe('getAccountIdentifier', () => {
    it(`should return the account identifier for an address on mainnet`, async () => {
      const address: string = 'tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7'
      const network: Network = { type: NetworkType.MAINNET }

      const accountIdentifier: string = await getAccountIdentifier(address, network)

      expect(accountIdentifier).to.deep.equal('2PcnkiqnqcQcq3Wko1yjDoqGjgL5')
    })

    it(`should return the account identifier for an address on delphinet`, async () => {
      const address: string = 'tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7'
      const network: Network = { type: NetworkType.DELPHINET }

      const accountIdentifier: string = await getAccountIdentifier(address, network)

      expect(accountIdentifier).to.deep.equal('2xjLkeC8LfPm1b3s4rDM6P2miJcD')
    })

    it(`should return the account identifier for an address on custom net`, async () => {
      const address: string = 'tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7'
      const network: Network = {
        type: NetworkType.CUSTOM,
        name: 'Test',
        rpcUrl: 'http://localhost:8080/'
      }

      const accountIdentifier: string = await getAccountIdentifier(address, network)

      expect(accountIdentifier).to.deep.equal('3GVG5Ggv21UMyD5qph2MCoHYtfFm')
    })

    it(`should return different account identifier for different network names`, async () => {
      const address: string = 'tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7'
      const network1: Network = { type: NetworkType.MAINNET, name: 'Mainnet 1' }
      const network2: Network = { type: NetworkType.MAINNET, name: 'Mainnet 2' }

      const accountIdentifier1: string = await getAccountIdentifier(address, network1)
      const accountIdentifier2: string = await getAccountIdentifier(address, network2)

      expect(accountIdentifier1).to.not.equal(accountIdentifier2)
    })

    it(`should return different account identifier for different network rpcUrls`, async () => {
      const address: string = 'tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7'
      const network1: Network = { type: NetworkType.MAINNET, rpcUrl: 'http://localhost/' }
      const network2: Network = { type: NetworkType.MAINNET, rpcUrl: 'http://localhost:8080/' }

      const accountIdentifier1: string = await getAccountIdentifier(address, network1)
      const accountIdentifier2: string = await getAccountIdentifier(address, network2)

      expect(accountIdentifier1).to.not.equal(accountIdentifier2)
    })

    it(`should return different account identifier for same name or rpcUrl`, async () => {
      const address: string = 'tz1d75oB6T4zUMexzkr5WscGktZ1Nss1JrT7'
      const network1: Network = { type: NetworkType.MAINNET, name: 'http://localhost:8080/' }
      const network2: Network = { type: NetworkType.MAINNET, rpcUrl: 'http://localhost:8080/' }

      const accountIdentifier1: string = await getAccountIdentifier(address, network1)
      const accountIdentifier2: string = await getAccountIdentifier(address, network2)

      expect(accountIdentifier1).to.not.equal(accountIdentifier2)
    })
  })
})
