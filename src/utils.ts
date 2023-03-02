export function isCallback<S>(
  maybeFunction: any
): maybeFunction is (value: S) => S {
  return typeof maybeFunction === 'function';
}
