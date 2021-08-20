export const bscPools = [
  {
    id: 'coink-maxi',
    logo: 'single-assets/COINK.png',
    name: 'COINK Maxi',
    token: 'COINK',
    tokenDescription: 'Piggybankone.Finance',
    tokenAddress: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
    tokenDecimals: 18,
    earnedToken: 'pigCOINK',
    earnedTokenAddress: '0xf7069e41C57EcC5F122093811d8c75bdB5f7c14e',
    earnContractAddress: '0xf7069e41C57EcC5F122093811d8c75bdB5f7c14e',
    pricePerFullShare: 1,
    tvl: 0,
    oracle: 'tokens',
    oracleId: 'COINK',
    oraclePrice: 0,
    depositsPaused: false,
    status: 'active',
    platform: 'Piggybankone.Finance',
    assets: ['COINK'],
    callFee: 0.5,
    withdrawalFee: '0.05%',
    buyTokenUrl: 'https://app.1inch.io/#/56/swap/BNB/COINK',
  },
  {
    id: 'cake-cakev2',
    logo: 'single-assets/CAKE.svg',
    name: 'CAKE',
    token: 'CAKE',
    tokenDescription: 'PancakeSwap',
    tokenAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    tokenDecimals: 18,
    earnedToken: 'pigCakeV2',
    earnedTokenAddress: '0x97e5d50Fe0632A95b9cf1853E744E02f7D816677',
    earnContractAddress: '0x97e5d50Fe0632A95b9cf1853E744E02f7D816677',
    pricePerFullShare: 1,
    tvl: 0,
    oracle: 'tokens',
    oracleId: 'Cake',
    oraclePrice: 0,
    depositsPaused: false,
    status: 'active',
    platform: 'PancakeSwap',
    assets: ['CAKE'],
    callFee: 0.5,
    withdrawalFee: '0%',
    buyTokenUrl:
      'https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  },
];