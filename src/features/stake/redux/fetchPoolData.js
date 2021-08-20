import { useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  STAKE_FETCH_POOL_DATA_BEGIN,
  STAKE_FETCH_POOL_DATA_FAILURE,
  STAKE_FETCH_POOL_DATA_SUCCESS,
} from './constants';
import { PigToken } from '../../configure/abi';
import { fetchPrice, whenPricesLoaded } from '../../web3';
import Web3 from 'web3';
import { getRpcUrl } from '../../../common/networkSetup';

export function fetchPoolData(index) {
  return (dispatch, getState) => {
    if (Array.isArray(index)) {
      index.forEach(id => {
        dispatch(fetchByIndex(id));
      });
    } else {
      dispatch(fetchByIndex(index));
    }
  };
}

export function fetchByIndex(index) {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const { home, stake } = getState();
      let { web3 } = home;
      const { pools } = stake;

      if (!web3) {
        web3 = new Web3(new Web3.providers.HttpProvider(getRpcUrl()));
      }

      const getTotalStaked = async pool => {
        const tokenPrice = await fetchPrice({ id: pool.tokenOracleId });
        const earnContract = new web3.eth.Contract(pool.earnContractAbi, pool.earnContractAddress);
        const totalSupply = new BigNumber(await earnContract.methods.totalSupply().call());
        const tokenDecimals = new BigNumber(10).exponentiatedBy(pool.tokenDecimals);
        const totalStaked = totalSupply.dividedBy(tokenDecimals);
        let totalStakedInUsd = totalSupply.times(tokenPrice).dividedBy(tokenDecimals);

        if (pool.isPigStaked) {
          const pigToken = new web3.eth.Contract(PigToken, pool.tokenAddress);
          const pigTokenDecimals = new BigNumber(10).exponentiatedBy(18);
          const pricePerShare = new BigNumber(await pigToken.methods.getPricePerFullShare().call());

          totalStakedInUsd = totalStakedInUsd.times(pricePerShare).dividedBy(pigTokenDecimals);
        }

        return [totalStaked, totalStakedInUsd];
      };

      const getYearlyRewardsInUsd = async pool => {
        const tokenPrice = fetchPrice({ id: pool.earnedOracleId });
        const rewardPool = new web3.eth.Contract(pool.earnContractAbi, pool.earnContractAddress);
        const rewardRate = new BigNumber(await rewardPool.methods.rewardRate().call());
        const yearlyRewards = rewardRate.times(3600).times(24).times(365);

        return yearlyRewards
          .times(tokenPrice)
          .dividedBy(new BigNumber(10).exponentiatedBy(pool.earnedTokenDecimals));
      };

      const getPoolData = async (pool, index) => {
        const [yearlyRewardsInUsd, [totalStaked, totalStakedInUsd]] = await Promise.all([
          getYearlyRewardsInUsd(pool),
          getTotalStaked(pool),
        ]);

        const data = {
          apy: Number(yearlyRewardsInUsd.dividedBy(totalStakedInUsd)),
          staked: totalStaked,
          tvl: totalStakedInUsd.toFixed(2),
        };

        return data;
      };

      dispatch({
        type: STAKE_FETCH_POOL_DATA_BEGIN,
        index,
      });

      await whenPricesLoaded();
      const data = await getPoolData(pools[index], index);

      dispatch({
        type: STAKE_FETCH_POOL_DATA_SUCCESS,
        data: data,
        index,
      });

      resolve();
    }).catch(() => {
      dispatch({ type: STAKE_FETCH_POOL_DATA_FAILURE });
    });
  };
}

export function useFetchPoolData() {
  const dispatch = useDispatch();
  const { pools, poolData, fetchPoolDataPending } = useSelector(state => ({
    pools: state.stake.pools,
    poolData: state.stake.poolData,
    fetchPoolDataPending: state.stake.fetchPoolDataPending,
  }));

  const boundAction = useCallback(data => dispatch(fetchPoolData(data)), [dispatch]);

  return {
    pools,
    poolData,
    fetchPoolData: boundAction,
    fetchPoolDataPending,
  };
}

export function reducer(state, action) {
  const { pools, poolData, fetchPoolDataPending } = state;
  switch (action.type) {
    case STAKE_FETCH_POOL_DATA_BEGIN:
      // Just after a request is sent
      fetchPoolDataPending[action.index] = true;
      return {
        ...state,
        fetchPoolDataPending,
      };

    case STAKE_FETCH_POOL_DATA_SUCCESS:
      // The request is success
      pools[action.index] = { ...pools[action.index], ...action.data };
      poolData[action.index] = action.data;
      fetchPoolDataPending[action.index] = false;
      return {
        ...state,
        poolData,
        fetchPoolDataPending,
      };

    case STAKE_FETCH_POOL_DATA_FAILURE:
      // The request is failed
      fetchPoolDataPending[action.index] = false;
      return {
        ...state,
        fetchPoolDataPending,
      };

    default:
      return state;
  }
}
