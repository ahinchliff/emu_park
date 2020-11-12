import { useState } from "react";

export type InputProps<T> = {
  value: T;
  onChangeText(value: T): void;
};

const useInputState = <T>(
  initialValue: T,
  onChange?: (value: T) => void
): InputProps<T> => {
  const [value, setValue] = useState<T>(initialValue);

  const onChangeText = (value: T) => {
    if (onChange) {
      onChange(value);
    }
    setValue(value);
  };

  const props = {
    value,
    onChangeText,
  };

  return props;
};

export default useInputState;
