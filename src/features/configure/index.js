import { addressBook } from 'blockchain-addressbook';
console.log('-- addressBook : ', addressBook)
const {
  polygon: polygonAddressBook,
  heco: hecoAddressBook,
  avax: avaxAddressBook,
  bsc: bscAddressBook,
  fantom: fantomAddressBook,
  one: harmonyAddressBook,
} = addressBook;
export { bscAddressBook, hecoAddressBook, avaxAddressBook, polygonAddressBook, fantomAddressBook, harmonyAddressBook };

export {
  vaultABI,
  bnbVaultABI,
  erc20ABI,
  strategyABI,
  multicallABI,
  govPoolABI,
  piggybankUniV2ZapABI,
  uniswapV2PairABI,
  uniswapV2RouterABI,
} from './abi';
export { bscStakePools } from './stake/bsc_stake';
export { hecoStakePools } from './stake/heco_stake';
export { avalancheStakePools } from './stake/avalanche_stake';
export { polygonStakePools } from './stake/polygon_stake';
export { fantomStakePools } from './stake/fantom_stake';
export { harmonyStakePools } from './stake/harmony_stake';
export { bscPools } from './vault/bsc_pools';
export { hecoPools } from './vault/heco_pools';
export { avalanchePools } from './vault/avalanche_pools';
export { bscZaps } from './zap/bsc_zaps';
export { hecoZaps } from './zap/heco_zaps';
export { avalancheZaps } from './zap/avalanche_zaps';
export { polygonZaps } from './zap/polygon_zaps';
export { fantomZaps } from './zap/fantom_zaps';
export { harmonyZaps } from './zap/harmony_zaps';
export { nativeCoins } from './native_coins';
export { polygonPools } from './vault/polygon_pools';
export { fantomPools } from './vault/fantom_pools';
export { harmonyPools } from './vault/harmony_pools';
