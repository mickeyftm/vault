import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  VAULT_FETCH_COINKBUYBACK_BEGIN,
  VAULT_FETCH_COINKBUYBACK_SUCCESS,
  VAULT_FETCH_COINKBUYBACK_FAILURE,
} from './constants';
import { getApiCacheBuster } from '../../web3/getApiCacheBuster';

export function fetchCoinkbuyback() {
  return dispatch => {
    dispatch({
      type: VAULT_FETCH_COINKBUYBACK_BEGIN,
    });

    return new Promise((resolve, reject) => {
      const cacheBuster = getApiCacheBuster();
      const doRequest = axios.get(`https://api.beefy.finance/coinkbuyback?_=${cacheBuster}`);

      doRequest.then(
        res => {
          dispatch({
            type: VAULT_FETCH_COINKBUYBACK_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        err => {
          dispatch({
            type: VAULT_FETCH_COINKBUYBACK_FAILURE,
            data: { error: err },
          });
          reject(err);
        }
      );
    });
  };
}

export function useFetchCoinkbuyback() {
  const dispatch = useDispatch();

  const { coinkbuyback, fetchCoinkbuybackPending, fetchCoinkbuybackDone } = useSelector(
    state => ({
      coinkbuyback: state.vault.coinkbuyback,
      fetchCoinkbuybackDone: state.vault.fetchCoinkbuybackDone,
      fetchCoinkbuybackPending: state.vault.fetchCoinkbuybackPending,
    }),
    shallowEqual
  );

  const boundAction = useCallback(() => {
    dispatch(fetchCoinkbuyback());
  }, [dispatch]);

  return {
    coinkbuyback,
    fetchCoinkbuyback: boundAction,
    fetchCoinkbuybackDone,
    fetchCoinkbuybackPending,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case VAULT_FETCH_COINKBUYBACK_BEGIN:
      return {
        ...state,
        fetchCoinkbuybackPending: true,
      };

    case VAULT_FETCH_COINKBUYBACK_SUCCESS:
      return {
        ...state,
        coinkbuyback: action.data,
        fetchCoinkbuybackDone: true,
        fetchCoinkbuybackPending: false,
      };

    case VAULT_FETCH_COINKBUYBACK_FAILURE:
      return {
        ...state,
        fetchCoinkbuybackPending: false,
      };

    default:
      return state;
  }
}
