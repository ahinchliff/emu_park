import { useState } from "react";

export type InputProps<T> = {
  value: T;
  onChangeText(value: T): void;
};

export const useFormInput = <T>(initialValue: T): InputProps<T> => {
  const [value, setValue] = useState<T>(initialValue);

  const onChangeText = (value: T) => {
    setValue(value);
  };

  const props = {
    value,
    onChangeText,
  };

  return props;
};
