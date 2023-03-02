const globalState: {
  [key: string]: { callbacks: ((value: any) => void)[]; value: any };
} = {};

export type GlobalState<S> = {
  deregister(): void;
  emit(value: S | ((v: S) => S)): void;
};

function createGlobalState<S>(
  key: string,
  thisCallback: (value: S) => void,
  initialValue: S | ((value: S) => S)
): GlobalState<S> {
  if (!globalState[key]) {
    globalState[key] = { callbacks: [], value: initialValue };
  }
  globalState[key].callbacks.push(thisCallback);
  return {
    deregister() {
      const arr = globalState[key].callbacks;
      const index = arr.indexOf(thisCallback);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    emit(value: S) {
      if (globalState[key].value !== value) {
        globalState[key].value = value;
        globalState[key].callbacks.forEach((callback) => {
          if (thisCallback !== callback) {
            callback(value);
          }
        });
      }
    },
  };
}

export default createGlobalState;
