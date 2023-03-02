import { isCallback } from './utils';

export type PersistedStorage<S> = {
  get(key: string, defaultValue: S | ((value: S) => S)): S;
  set(key: string, value: S): void;
};

function createStorage<S>(
  provider: Pick<Storage, 'getItem' | 'setItem'>
): PersistedStorage<S> {
  return {
    get(key: string, defaultValue: S | (() => S)): S {
      const json = provider.getItem(key);

      if (json === null || typeof json === 'undefined') {
        return isCallback<S>(defaultValue) ? defaultValue() : defaultValue;
      }

      try {
        return JSON.parse(json);
      } catch {
        return String(json) as unknown as S;
      }
    },
    set(key: string, value: S) {
      provider.setItem(
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      );
    },
  };
}

export default createStorage;
