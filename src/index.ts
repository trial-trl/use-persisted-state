import { Dispatch, SetStateAction, useState } from 'react';

import usePersistedState from './usePersistedState';
import createStorage from './createStorage';

const getProvider = () => {
  if (typeof global !== 'undefined' && global.localStorage) {
    return global.localStorage;
  }
  // eslint-disable-next-line no-undef
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    // eslint-disable-next-line no-undef
    return globalThis.localStorage;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return null;
};

function createPersistedState<S>(
  key: string,
  provider: Pick<Storage, 'getItem' | 'setItem'> | null = getProvider()
):
  | ((initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>])
  | (() => [S | undefined, Dispatch<SetStateAction<S | undefined>>]) {
  if (provider) {
    const storage = createStorage<S>(provider);
    return (initialState: S | (() => S)) =>
      usePersistedState(initialState, key, storage);
  }
  return useState;
}

export default createPersistedState;
