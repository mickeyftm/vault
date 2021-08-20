// To run: yarn validate
import { MultiCall } from 'eth-multicall';
import { addressBook } from 'blockchain-addressbook';
import Web3 from 'web3';

import { isValidChecksumAddress, maybeChecksumAddress } from './utils.js';
import { bscPools } from '../src/features/configure/vault/bsc_pools.js';
import { hecoPools } from '../src/features/configure/vault/heco_pools.js';
import { avalanchePools } from '../src/features/configure/vault/avalanche_pools.js';
import { polygonPools } from '../src/features/configure/vault/polygon_pools.js';
import { fantomPools } from '../src/features/configure/vault/fantom_pools.js';
import { harmonyPools } from '../src/features/configure/vault/harmony_pools.js';
import { vaultABI, strategyABI } from '../src/features/configure/abi.js';

const chainPools = {
  bsc: bscPools,
  heco: hecoPools,
  avax: avalanchePools,
  polygon: polygonPools,
  fantom: fantomPools,
  harmony: harmonyPools,
};

const chainRpcs = {
  bsc: process.env.BSC_RPC || 'https://bsc-dataseed.binance.org/',
  heco: process.env.HECO_RPC || 'https://http-mainnet.hecochain.com',
  avax: process.env.AVAX_RPC || 'https://api.avax.network/ext/bc/C/rpc',
  polygon: process.env.POLYGON_RPC || 'https://rpc-mainnet.maticvigil.com',
  fantom: process.env.FANTOM_RPC || 'https://rpc.ftm.tools/',
  harmony: process.env.HARMONY_RPC || 'https://api.harmony.one/',
};

const validatePools = async () => {
  const addressFields = ['tokenAddress', 'earnedTokenAddress', 'earnContractAddress'];

  const allowedEarnSameToken = new Set(['venus-wbnb']);

  // Outputs alphabetical list of platforms per chain (useful to make sure they are consistently named)
  const outputPlatformSummary = process.argv.includes('--platform-summary');

  let exitCode = 0;

  let updates = {};

  for (let [chain, pools] of Object.entries(chainPools)) {
    console.log(`Validating ${pools.length} pools in ${chain}...`);

    const uniquePoolId = new Set();
    const uniqueEarnedToken = new Set();
    const uniqueEarnedTokenAddress = new Set();
    const uniqueOracleId = new Set();
    const platformCounts = {};
    let activePools = 0;

    // Populate some extra data.
    const web3 = new Web3(chainRpcs[chain]);
    pools = await populateStrategyAddrs(chain, pools, web3);
    pools = await populateKeepers(chain, pools, web3);
    pools = await populatePiggybankVaultFeeRecipients(chain, pools, web3);
    pools = await populateOwners(chain, pools, web3);

    pools.forEach(pool => {
      // Errors, should not proceed with build
      if (uniquePoolId.has(pool.id)) {
        console.error(`Error: ${pool.id} : Pool id duplicated: ${pool.id}`);
        exitCode = 1;
      }

      if (uniqueEarnedToken.has(pool.earnedToken) && !allowedEarnSameToken.has(pool.id)) {
        console.error(`Error: ${pool.id} : Pool earnedToken duplicated: ${pool.earnedToken}`);
        exitCode = 1;
      }

      if (
        uniqueEarnedTokenAddress.has(pool.earnedTokenAddress) &&
        !allowedEarnSameToken.has(pool.id)
      ) {
        console.error(
          `Error: ${pool.id} : Pool earnedTokenAddress duplicated: ${pool.earnedTokenAddress}`
        );
        exitCode = 1;
      }

      if (pool.earnedTokenAddress !== pool.earnContractAddress) {
        console.error(
          `Error: ${pool.id} : Pool earnedTokenAddress not same as earnContractAddress: ${pool.earnedTokenAddress} != ${pool.earnContractAddress}`
        );
        exitCode = 1;
      }

      if (!pool.tokenDescription) {
        console.error(
          `Error: ${pool.id} : Pool tokenDescription missing - required for UI: vault card`
        );
        exitCode = 1;
      }

      if (!pool.platform) {
        console.error(
          `Error: ${pool.id} : Pool platform missing - required for UI: filter (Use 'Other' if necessary)`
        );
        exitCode = 1;
      } else {
        platformCounts[pool.platform] = platformCounts.hasOwnProperty(pool.platform)
          ? platformCounts[pool.platform] + 1
          : 1;
      }

      addressFields.forEach(field => {
        if (pool.hasOwnProperty(field) && !isValidChecksumAddress(pool[field])) {
          const maybeValid = maybeChecksumAddress(pool[field]);
          console.error(
            `Error: ${pool.id} : ${field} requires checksum - ${
              maybeValid ? `\n\t${field}: '${maybeValid}',` : 'it is invalid'
            }`
          );
          exitCode = 1;
        }
      });

      if (pool.status === 'active') {
        activePools++;
      }

      uniquePoolId.add(pool.id);
      uniqueEarnedToken.add(pool.earnedToken);
      uniqueEarnedTokenAddress.add(pool.earnedTokenAddress);
      uniqueOracleId.add(pool.oracleId);

      const { keeper, strategyOwner, vaultOwner, piggybankFeeRecipient } =
        addressBook[chain].platforms.piggybankonevault;

      updates = isKeeperCorrect(pool, chain, keeper, updates);
      updates = isStratOwnerCorrect(pool, chain, strategyOwner, updates);
      updates = isVaultOwnerCorrect(pool, chain, vaultOwner, updates);
      updates = isPiggybankVaultFeeRecipientCorrect(pool, chain, piggybankFeeRecipient, updates);
    });

    if (outputPlatformSummary) {
      console.log(
        `Platforms: \n${Object.entries(platformCounts)
          .sort(([platformA], [platformB]) =>
            platformA.localeCompare(platformB, 'en', { sensitivity: 'base' })
          )
          .map(([platform, count]) => `\t${platform} (${count})`)
          .join('\n')}`
      );
    }

    console.log(`Active pools: ${activePools}/${pools.length}\n`);
  }

  // Helpful data structures to correct addresses.
  console.log('Required updates.', JSON.stringify(updates));

  return exitCode;
};

// Validation helpers. These only log for now, could throw error if desired.
const isKeeperCorrect = (pool, chain, chainKeeper, updates) => {
  if (pool.keeper !== undefined && pool.keeper !== chainKeeper) {
    console.log(`Pool ${pool.id} should update keeper. From: ${pool.keeper} To: ${chainKeeper}`);

    if (!('keeper' in updates)) updates['keeper'] = {};
    if (!(chain in updates.keeper)) updates.keeper[chain] = {};

    if (pool.keeper in updates.keeper[chain]) {
      updates.keeper[chain][pool.keeper].push(pool.strategy);
    } else {
      updates.keeper[chain][pool.keeper] = [pool.strategy];
    }
  }

  return updates;
};

const isStratOwnerCorrect = (pool, chain, owner, updates) => {
  if (pool.stratOwner !== undefined && pool.keeper !== undefined && pool.stratOwner !== owner) {
    console.log(`Pool ${pool.id} should update strat owner. From: ${pool.stratOwner} To: ${owner}`);

    if (!('stratOwner' in updates)) updates['stratOwner'] = {};
    if (!(chain in updates.stratOwner)) updates.stratOwner[chain] = {};

    if (pool.stratOwner in updates.stratOwner[chain]) {
      updates.stratOwner[chain][pool.stratOwner].push(pool.strategy);
    } else {
      updates.stratOwner[chain][pool.stratOwner] = [pool.strategy];
    }
  }

  return updates;
};

const isVaultOwnerCorrect = (pool, chain, owner, updates) => {
  if (pool.vaultOwner !== undefined && pool.vaultOwner !== owner) {
    console.log(`Pool ${pool.id} should update vault owner. From: ${pool.vaultOwner} To: ${owner}`);

    if (!('vaultOwner' in updates)) updates['vaultOwner'] = {};
    if (!(chain in updates.vaultOwner)) updates.vaultOwner[chain] = {};

    if (pool.vaultOwner in updates.vaultOwner[chain]) {
      updates.vaultOwner[chain][pool.vaultOwner].push(pool.earnContractAddress);
    } else {
      updates.vaultOwner[chain][pool.vaultOwner] = [pool.earnContractAddress];
    }
  }

  return updates;
};

const isPiggybankVaultFeeRecipientCorrect = (pool, chain, recipient, updates) => {
  if (
    pool.status === 'active' &&
    pool.piggybankFeeRecipient !== undefined &&
    pool.piggybankFeeRecipient !== recipient
  ) {
    console.log(
      `Pool ${pool.id} should update piggybank fee recipient. From: ${pool.piggybankFeeRecipient} To: ${recipient}`
    );

    if (!('piggybankFeeRecipient' in updates)) updates['piggybankFeeRecipient'] = {};
    if (!(chain in updates.piggybankFeeRecipient)) updates.piggybankFeeRecipient[chain] = {};

    if (pool.stratOwner in updates.piggybankFeeRecipient[chain]) {
      updates.piggybankFeeRecipient[chain][pool.stratOwner].push(pool.strategy);
    } else {
      updates.piggybankFeeRecipient[chain][pool.stratOwner] = [pool.strategy];
    }
  }

  return updates;
};

// Helpers to populate required addresses.

const populateStrategyAddrs = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, addressBook[chain].platforms.piggybankonevault.multicall);

  const calls = pools.map(pool => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.earnContractAddress);
    return {
      strategy: vaultContract.methods.strategy(),
    };
  });

  const [results] = await multicall.all([calls]);

  return pools.map((pool, i) => {
    return { ...pool, strategy: results[i].strategy };
  });
};

const populateKeepers = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, addressBook[chain].platforms.piggybankonevault.multicall);

  const calls = pools.map(pool => {
    const stratContract = new web3.eth.Contract(strategyABI, pool.strategy);
    return {
      keeper: stratContract.methods.keeper(),
    };
  });

  const [results] = await multicall.all([calls]);

  return pools.map((pool, i) => {
    return { ...pool, keeper: results[i].keeper };
  });
};

const populatePiggybankVaultFeeRecipients = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, addressBook[chain].platforms.piggybankonevault.multicall);

  const calls = pools.map(pool => {
    const stratContract = new web3.eth.Contract(strategyABI, pool.strategy);
    return {
      piggybankFeeRecipient: stratContract.methods.piggybankFeeRecipient(),
    };
  });

  const [results] = await multicall.all([calls]);

  return pools.map((pool, i) => {
    return { ...pool, piggybankFeeRecipient: results[i].piggybankFeeRecipient };
  });
};

const populateOwners = async (chain, pools, web3) => {
  const multicall = new MultiCall(web3, addressBook[chain].platforms.piggybankonevault.multicall);

  const vaultCalls = pools.map(pool => {
    const vaultContract = new web3.eth.Contract(vaultABI, pool.earnContractAddress);
    return {
      owner: vaultContract.methods.owner(),
    };
  });

  const stratCalls = pools.map(pool => {
    const stratContract = new web3.eth.Contract(strategyABI, pool.strategy);
    return {
      owner: stratContract.methods.owner(),
    };
  });

  const [vaultResults] = await multicall.all([vaultCalls]);
  const [stratResults] = await multicall.all([stratCalls]);

  return pools.map((pool, i) => {
    return { ...pool, vaultOwner: vaultResults[i].owner, stratOwner: stratResults[i].owner };
  });
};

const exitCode = await validatePools();
process.exit(exitCode);
