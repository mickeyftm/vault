import { connectors } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import {
  avalanchePools,
  avalancheStakePools,
  avaxAddressBook,
  avalancheZaps,
  bscPools,
  bscStakePools,
  bscAddressBook,
  bscZaps,
  fantomPools,
  fantomStakePools,
  fantomAddressBook,
  fantomZaps,
  hecoPools,
  hecoStakePools,
  hecoAddressBook,
  hecoZaps,
  nativeCoins,
  polygonPools,
  polygonStakePools,
  polygonAddressBook,
  polygonZaps,
  harmonyPools,
  harmonyStakePools,
  harmonyAddressBook,
  harmonyZaps,
} from '../configure';

const networkTxUrls = {
  56: hash => `https://bscscan.com/tx/${hash}`,
  128: hash => `https://hecoinfo.com/tx/${hash}`,
  43114: hash => `https://cchain.explorer.avax.network/tx/${hash}/token-transfers`,
  137: hash => `https://polygonscan.com/tx/${hash}`,
  250: hash => `https://ftmscan.com/tx/${hash}`,
  1666600000: hash => `https://explorer.harmony.one/tx/${hash}`,
};

const networkAppUrls = {
  56: 'https://vault.piggybankone.finance/',
  128: 'https://hecovault.piggybankone.finance/',
  43114: 'https://avaxvault.piggybankone.finance/',
  137: 'https://polygonvault.piggybankone.finance/',
  250: 'https://fantomvault.piggybankone.finance/',
  1666600000: 'https://harmonyvault.piggybankone.finance/',
};

const networkFriendlyName = {
  56: 'BSC',
  128: 'HECO',
  43114: 'AVAX',
  137: 'Polygon',
  250: 'Fantom',
  1666600000: 'Harmony',
};

const networkBuyUrls = {
  56: 'https://app.1inch.io/#/r/0xF4cb25a1FF50E319c267b3E51CBeC2699FB2A43B',
  128: 'https://ht.mdex.com/#/swap?inputCurrency=0xa71edc38d189767582c38a3145b5873052c3e47a&outputCurrency=0x765277eebeca2e31912c9946eae1021199b39c61',
  137: 'https://app.1inch.io/#/r/0xF4cb25a1FF50E319c267b3E51CBeC2699FB2A43B',
  250: 'https://spookyswap.finance/swap?inputCurrency=0x04068da6c83afcfa0e13ba15a6696662335d5b75&outputCurrency=0xd6070ae98b8069de6B494332d1A1a81B6179D960',
  43114: 'https://app.1inch.io/#/r/0xF4cb25a1FF50E319c267b3E51CBeC2699FB2A43B',
  1666600000: 'https://swap.piggybankone.finance/?inputCurrency=0x0ab43550a6915f9f67d0c454c2e90385e6497eaa&outputCurrency=0x4970417a897Cc7ae812b9b8Db34bb44833C26739',
};

export const getNetworkCoin = () => {
  return nativeCoins.find(coin => coin.chainId === Number(process.env.REACT_APP_NETWORK_ID));
};

export const getNetworkPools = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscPools;
    case '128':
      return hecoPools;
    case '43114':
      return avalanchePools;
    case '137':
      return polygonPools;
    case '250':
      return fantomPools;
    case '1666600000':
      return harmonyPools;
    default:
      return [];
  }
};

export const getNetworkTokens = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscAddressBook.tokens;
    case '128':
      return hecoAddressBook.tokens;
    case '43114':
      return avaxAddressBook.tokens;
    case '137':
      return polygonAddressBook.tokens;
    case '250':
      return fantomAddressBook.tokens;
    case '1666600000':
      return harmonyAddressBook.tokens;
    default:
      throw new Error(
        `Create address book for this chainId first. Check out https://github.com/piggybankone/vault/address-book`
      );
  }
};

export const getNetworkBurnTokens = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return {
        [bscAddressBook.tokens.GARUDA.symbol]: bscAddressBook.tokens.GARUDA,
        [bscAddressBook.tokens.SDUMP.symbol]: bscAddressBook.tokens.SDUMP,
      };
    case '128':
      return {};
    case '43114':
      return {};
    case '137':
      return {};
    case '250':
      return {};
    case '1666600000':
      return {};
    default:
      throw new Error(
        `Create address book for this chainId first. Check out https://github.com/piggybankone/vault/address-book`
      );
  }
};

export const getNetworkZaps = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscZaps;
    case '128':
      return hecoZaps;
    case '43114':
      return avalancheZaps;
    case '137':
      return polygonZaps;
    case '250':
      return fantomZaps;
    case '1666600000':
      return harmonyZaps;
    default:
      return [];
  }
};

export const getNetworkStakePools = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return bscStakePools;
    case '128':
      return hecoStakePools;
    case '43114':
      return avalancheStakePools;
    case '137':
      return polygonStakePools;
    case '250':
      return fantomStakePools;
    case '1666600000':
      return harmonyStakePools;
    default:
      return [];
  }
};

export const getNetworkStables = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return [
        'BUSD',
        'USDT',
        'USDC',
        'DAI',
        'VAI',
        'QUSD',
        'UST',
        'VENUS BLP',
        '3EPS',
        'fUSDT',
        '4BELT',
        'IRON',
        'DOLLY',
        'TUSD',
      ];
    case '128':
      return ['USDT', 'HUSD'];
    case '43114':
      return ['USDT', 'DAI', 'BUSD', 'zDAI', 'zUSDT'];
    case '137':
      return ['USDC', 'USDT', 'maUSDC', 'DAI', 'IRON', 'MAI', 'FRAX', 'rUSD'];
    case '250':
      return ['USDC', 'USDT', 'DAI', 'fUSDT'];
    case '1666600000':
      return ['bscBUSD', '1USDT', '1DAI', '1USDC'];
    default:
      return [];
  }
};

export const getNetworkMulticall = () => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return '0xB94858b0bB5437498F5453A16039337e5Fdc269C';
    case '128':
      return '0x2776CF9B6E2Fa7B33A37139C3CB1ee362Ff0356e';
    case '43114':
      return '0x6FfF95AC47b586bDDEea244b3c2fe9c4B07b9F76';
    case '137':
      return '0xC3821F0b56FA4F4794d5d760f94B812DE261361B';
    case '250':
      return '0xC9F6b1B53E056fd04bE5a197ce4B2423d456B982';
    case '1666600000':
      return '0xFE4980f62D708c2A84D3929859Ea226340759320';
    default:
      return '';
  }
};

export const getNetworkConnectors = t => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case '56':
      return {
        network: 'binance',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: t('Home-BrowserWallet'),
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://bsc-dataseed.binance.org/',
                56: 'https://bsc-dataseed.binance.org/',
              },
            },
          },
          'custom-binance': {
            display: {
              name: 'Binance',
              description: t('Binance Chain Wallet'),
              logo: require(`images/wallets/binance-wallet.png`),
            },
            package: 'binance',
            connector: async (ProviderPackage, options) => {
              const provider = window.BinanceChain;
              await provider.enable();
              return provider;
            },
          },
          'custom-math': {
            display: {
              name: 'Math',
              description: t('Math Wallet'),
              logo: require(`images/wallets/math-wallet.svg`),
            },
            package: 'math',
            connector: connectors.injected,
          },
          'custom-twt': {
            display: {
              name: 'Trust',
              description: t('Trust Wallet'),
              logo: require(`images/wallets/trust-wallet.svg`),
            },
            package: 'twt',
            connector: connectors.injected,
          },
          'custom-safepal': {
            display: {
              name: 'SafePal',
              description: t('SafePal App'),
              logo: require(`images/wallets/safepal-wallet.svg`),
            },
            package: 'safepal',
            connector: connectors.injected,
          },
        },
      };
    case '128':
      return {
        network: 'heco',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: t('Home-BrowserWallet'),
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://http-mainnet.hecochain.com',
                128: 'https://http-mainnet.hecochain.com',
              },
            },
          },
          'custom-math': {
            display: {
              name: 'Math',
              description: t('Math Wallet'),
              logo: require(`images/wallets/math-wallet.svg`),
            },
            package: 'math',
            connector: connectors.injected,
          },
        },
      };
    case '43114':
      return {
        network: 'avalanche',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: t('Home-BrowserWallet'),
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://api.avax.network/ext/bc/C/rpc',
                43114: 'https://api.avax.network/ext/bc/C/rpc',
              },
            },
          },
        },
      };
    case '137':
      return {
        network: 'polygon',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: t('Home-BrowserWallet'),
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://rpc-mainnet.maticvigil.com/',
                137: 'https://rpc-mainnet.maticvigil.com/',
              },
            },
          },
        },
      };
    case '250':
      return {
        network: 'fantom',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: t('Home-BrowserWallet'),
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://rpcapi.fantom.network',
                250: 'https://rpcapi.fantom.network',
              },
            },
          },
        },
      };
    case '1666600000':
      return {
        network: 'harmony',
        cacheProvider: true,
        providerOptions: {
          injected: {
            display: {
              name: 'Injected',
              description: t('Home-BrowserWallet'),
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {
                1: 'https://api.harmony.one',
                1666600000: 'https://api.harmony.one',
              },
            },
          },
        },
      };
    default:
      return {};
  }
};

export const getNetworkTxUrl = networkTxUrls[process.env.REACT_APP_NETWORK_ID];
export const getNetworkFriendlyName = (networkId = process.env.REACT_APP_NETWORK_ID) =>
  networkFriendlyName[networkId];
export const getNetworkBuyUrl = (networkId = process.env.REACT_APP_NETWORK_ID) =>
  networkBuyUrls[networkId];
export const getNetworkAppUrl = (networkId = process.env.REACT_APP_NETWORK_ID) =>
  networkAppUrls[networkId];
