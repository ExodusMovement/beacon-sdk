import { App, DesktopApp, ExtensionApp, WebApp } from 'packages/beacon-types/src/types/ui'

// TODO: Temporary build fix
export enum NetworkType {
  MAINNET = 'mainnet',
  GHOSTNET = 'ghostnet', // Long running testnet
  MONDAYNET = 'mondaynet', // Testnet, resets every monday
  DAILYNET = 'mondaynet', // Testnet, resets every day
  DELPHINET = 'delphinet',
  EDONET = 'edonet',
  FLORENCENET = 'florencenet',
  GRANADANET = 'granadanet',
  HANGZHOUNET = 'hangzhounet',
  ITHACANET = 'ithacanet',
  JAKARTANET = 'jakartanet',
  KATHMANDUNET = 'kathmandunet',
  LIMANET = 'limanet',
  MUMBAINET = 'mumbainet',
  CUSTOM = 'custom'
}

export const tezosExtensionList: ExtensionApp[] = [
  {
    key: 'spire_chrome',
    id: 'gpfndedineagiepkpinficbcbbgjoenn',
    name: 'Spire',
    shortName: 'Spire',
    color: '',
    logo: 'extension-spire.png',
    link: 'https://spirewallet.com/'
  },
  {
    key: 'temple_chrome',
    id: 'ookjlbkiijinhpmnjffcofjonbfbgaoc',
    name: 'Temple Wallet Chrome',
    shortName: 'Temple',
    color: '',
    logo: 'extension-temple.png',
    link: 'https://templewallet.com/'
  },
  {
    key: 'temple_firefox',
    id: '{34ac229e-1cf5-4e4c-8a77-988155c4360f}',
    name: 'Temple Wallet Firefox',
    shortName: 'Temple',
    color: '',
    logo: 'extension-temple.png',
    link: 'https://templewallet.com/'
  }

]

export const tezosWebList: WebApp[] = [
  {
    key: 'kukai_web',
    name: 'Kukai Wallet',
    shortName: 'Kukai',
    color: '',
    logo: 'web-kukai.png',
    links: {
      [NetworkType.MAINNET]: 'https://wallet.kukai.app',
      [NetworkType.GHOSTNET]: 'https://ghostnet.kukai.app',
      [NetworkType.MONDAYNET]: 'https://mondaynet.kukai.app',
      [NetworkType.DAILYNET]: 'https://dailynet.kukai.app',
      [NetworkType.DELPHINET]: 'https://testnet.kukai.app',
      [NetworkType.EDONET]: 'https://edonet.kukai.app',
      [NetworkType.FLORENCENET]: 'https://florencenet.kukai.app',
      [NetworkType.GRANADANET]: 'https://granadanet.kukai.app',
      [NetworkType.HANGZHOUNET]: 'https://hangzhounet.kukai.app',
      [NetworkType.ITHACANET]: 'https://ithacanet.kukai.app',
      [NetworkType.JAKARTANET]: 'https://jakartanet.kukai.app',
      [NetworkType.KATHMANDUNET]: 'https://kathmandunet.kukai.app',
      [NetworkType.LIMANET]: 'https://limanet.kukai.app',
      [NetworkType.MUMBAINET]: 'https://mumbainet.kukai.app'
    }
  }
]

export const tezosDesktopList: DesktopApp[] = [
  {
    key: 'infinity_wallet',
    name: 'Infinity Wallet',
    shortName: 'Infinity Wallet',
    color: 'rgb(52, 147, 218)',
    logo: 'infinity-wallet.png',
    deepLink: 'infinity://',
    downloadLink: 'https://infinitywallet.io/download'
  },
  {
    key: 'galleon_desktop',
    name: 'Galleon',
    shortName: 'Galleon',
    color: '',
    logo: 'desktop-galleon.png',
    deepLink: 'galleon://',
    downloadLink: 'https://cryptonomic.tech/galleon.html'
  },
  {
    key: 'umami_desktop',
    name: 'Umami',
    shortName: 'Umami',
    color: '',
    logo: 'desktop-umami.png',
    deepLink: 'umami://',
    downloadLink: 'https://umamiwallet.com/#download'
  },
  {
    key: 'atomex_desktop',
    name: 'Atomex Wallet',
    shortName: 'Atomex',
    color: '',
    logo: 'desktop-atomex.png',
    deepLink: 'atomex://',
    downloadLink: 'https://atomex.me/'
  }
]

export const tezosIosList: App[] = [
  {
    key: 'airgap_ios',
    name: 'AirGap Wallet',
    shortName: 'AirGap',
    color: 'rgb(4, 235, 204)',
    logo: 'ios-airgap.png',
    universalLink: 'https://wallet.airgap.it',
    deepLink: 'airgap-wallet://'
  },
  {
    key: 'naan_ios',
    name: 'naan - your portal to web3 ',
    shortName: 'naan',
    color: '',
    logo: 'ios-naan.png',
    universalLink: 'https://www.naan.app/',
    deepLink: 'naan://'
  },
  {
    key: 'altme_wallet',
    name: 'Altme Wallet',
    shortName: 'Altme',
    color: '',
    logo: 'altme.png',
    universalLink: 'https://app.altme.io/app/download'
  },
  {
    key: 'autonomy-app',
    name: 'Autonomy: Digital Art Wallet',
    shortName: 'Autonomy',
    color: '',
    logo: 'ios-autonomy.png',
    universalLink: 'https://autonomy.io/apps/tezos',
    deepLink: 'autonomy-tezos://'
  },
  {
    key: 'temple_ios',
    name: 'Temple Wallet',
    shortName: 'Temple',
    color: '',
    logo: 'ios-temple.png',
    universalLink: 'https://templewallet.com',
    deepLink: 'temple://'
  },
  {
    key: 'atomex_ios',
    name: 'Atomex Wallet',
    shortName: 'Atomex',
    color: '',
    logo: 'ios-atomex.png',
    universalLink: 'https://atomex.me',
    deepLink: 'atomex://'
  },
  {
    key: 'umami_ios',
    name: 'Umami Mobile',
    shortName: 'Umami Mobile',
    color: '',
    logo: 'desktop-umami.png',
    deepLink: 'umami://',
    universalLink: 'https://umamiwallet.com/'
  },
  {
    key: 'trust_ios',
    name: 'Trust Wallet',
    shortName: 'Trust Wallet',
    color: '',
    supportedInteractionStandards: ['wallet_connect'] as any,
    logo: 'ios-trust.png',
    universalLink: 'https://trustwallet.com',
    deepLink: 'trust://'
  }
  // {
  //   name: 'Galleon',
  //   shortName: 'Galleon',
  //   color: '',
  //   logo: 'ios-galleon.png',
  //   universalLink: 'https://cryptonomic.tech',
  //   deepLink: 'galleon://'
  // }
]
