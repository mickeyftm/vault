import { govPoolABI } from '../abi';

export const hecoStakePools = [
  {
    id: 'coink-ht',
    name: 'COINK',
    logo: 'single-assets/COINK.png',
    token: 'COINK',
    tokenDecimals: 18,
    tokenAddress: '0x765277EebeCA2e31912C9946eAe1021199B39C61',
    tokenOracle: 'tokens',
    tokenOracleId: 'COINK',
    earnedToken: 'HT',
    earnedTokenDecimals: 18,
    earnedTokenAddress: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
    earnContractAddress: '0x5f7347fedfD0b374e8CE8ed19Fc839F59FB59a3B',
    earnContractAbi: govPoolABI,
    earnedOracle: 'tokens',
    earnedOracleId: 'WHT',
    partnership: false,
    status: 'active',
    hideCountdown: true,
    partners: [
      {
        logo: 'stake/piggybank/piggybankfinance.png',
        background: 'stake/piggybank/background.png',
        text: "You probably already knew that Piggybank Vault is the most trusted Yield optimizer for the Binance Smart Chain. But did you know that Piggybank has its own token? COINK has a maximum supply of 80000 tokens and there is no way to mint more. Everyone who holds our own COINK token can not only do cool stuff like create and vote on proposals, they also get a share of all harvests done, every hour, every day on all our HECO vaults. That's a lot of HT that goes straight to our COINK holders. All you have to do is stake your COINK in this vault, it’s that simple, come back and harvest your HT whenever you need it!",
        website: 'https://vault.piggybankone.finance',
        social: {
          telegram: 'http://t.me/piggybankonevault',
          twitter: 'https://twitter.com/piggybankonevault',
        },
      },
    ],
  },
];
