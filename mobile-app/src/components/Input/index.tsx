import React from "react";
import Input, { Props } from "./Input_View";
export { Input };

type EmailInputProps = Omit<Props, "placeholder" | "icon" | "autoCapitalize">;

export const EmailInput: React.FC<EmailInputProps> = (props) => (
  <Input
    placeholder="john.smith@gmail.com"
    icon="envelope"
    autoCapitalize="none"
    {...props}
  />
);

type PasswordInputProps = Omit<
  Props,
  "icon" | "secureTextEntry" | "autoCapitalize"
>;

export const PasswordInput: React.FC<PasswordInputProps> = (props) => (
  <Input
    icon="lock"
    placeholder="********"
    autoCapitalize="none"
    secureTextEntry={true}
    {...props}
  />
);
