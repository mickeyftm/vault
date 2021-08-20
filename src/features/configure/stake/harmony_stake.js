import { govPoolABI } from '../abi';

export const harmonyStakePools = [
  {
    id: 'coink-harmony',
    name: 'COINK',
    logo: 'single-assets/COINK.png',
    token: 'COINK',
    tokenDecimals: 18,
    tokenAddress: '0x4970417a897Cc7ae812b9b8Db34bb44833C26739', // COINK
    tokenOracle: 'tokens',
    tokenOracleId: 'COINK',
    earnedToken: 'ONE',
    earnedTokenDecimals: 18,
    earnedTokenAddress: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a', // WONE
    earnContractAddress: '0xC8E09B7029f9e13E104F5239D7713D25A8C9dA0D', // PiggybankRewardPool(stake: COINK / reward: WONE)
    earnContractAbi: govPoolABI,
    earnedOracle: 'tokens',
    earnedOracleId: 'ONE',
    partnership: false,
    status: 'active',
    hideCountdown: true,
    partners: [
      {
        logo: 'stake/piggybank/piggybankfinance.png',
        background: 'stake/piggybank/background.png',
        text: "You probably already knew that Piggybank Vault is the most trusted multi-chain Yield optimizer. But did you know that Piggybank has its own token? COINK has a maximum supply of 80000 tokens and there is no way to mint more. Everyone who holds our own COINK token can not only do cool stuff like create and vote on proposals, they also get a share of all harvests done, every hour, every day on all our +120 vaults. That's a lot of FTM that goes straight to our COINK holders. All you have to do is stake your COINK in this vault, it’s that simple, come back and harvest your FTM whenever you need it! (You can still vote on proposals even though you have staked your COINK here).",
        website: 'https://vault.piggybankone.finance',
        social: {
          telegram: 'http://t.me/piggybankonevault',
          twitter: 'https://twitter.com/piggybankonevault',
        },
      },
    ],
  },
];
