import {
  useState,
  useEffect,
  useRef,
  useCallback,
  SetStateAction,
  Dispatch,
} from 'react';
import useEventListener from '@use-it/event-listener';

import createGlobalState, { GlobalState } from './createGlobalState';
import { PersistedStorage } from './createStorage';
import { isCallback } from './utils';

function usePersistedState<S>(
  initialState: S | ((value: S) => S),
  key: string,
  { get, set }: PersistedStorage<S>
): [S, Dispatch<SetStateAction<S>>] {
  const globalState = useRef<GlobalState<S>>();
  const [state, setState] = useState<S>(() => get(key, initialState));

  // subscribe to `storage` change events
  useEventListener('storage', ({ key: k, newValue }: any) => {
    if (k === key) {
      try {
        // for JSON values
        const newState = JSON.parse(newValue);
        if (state !== newState) {
          setState(newState);
        }
      } catch {
        // for non-JSON values
        if (state !== newValue) {
          setState(newValue);
        }
      }
    }
  });

  // only called on mount
  useEffect(() => {
    // register a listener that calls `setState` when another instance emits
    globalState.current = createGlobalState<S>(key, setState, initialState);

    return () => {
      globalState.current?.deregister();
    };
  }, [initialState, key]);

  const persistentSetState = useCallback(
    (newState: S | ((value: S) => S)) => {
      const newStateValue = isCallback<S>(newState)
        ? newState(state)
        : newState;

      // persist to localStorage
      set(key, newStateValue);

      setState(newStateValue);

      // inform all of the other instances in this tab
      globalState.current?.emit(newState);
    },
    [state, set, key]
  );

  return [state, persistentSetState];
}

export default usePersistedState;
