import { useState } from "react";

export type HandledErrorState<T> = {
  error: T | undefined;
  set(e: T): void;
  clear(): void;
};

export const useHandledErrorState = <T>(): HandledErrorState<T> => {
  const [error, setError] = useState<T | undefined>();

  const set = (e: T) => setError(e);
  const clear = () => setError(undefined);

  const props = {
    error,
    set,
    clear,
  };

  return props;
};
