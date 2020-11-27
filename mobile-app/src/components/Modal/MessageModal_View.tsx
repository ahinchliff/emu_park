import React from "react";
import { Text } from "react-native";
import BaseModal, { Props as BaseModalProps } from "./BaseModal_View";

export type Props = {
  message: string;
} & Omit<BaseModalProps, "children">;

const MessageModal: React.FC<Props> = (props) => {
  return (
    <BaseModal show={props.show} onClose={props.onClose}>
      <Text style={{ fontSize: 15, textAlign: "center" }}>{props.message}</Text>
    </BaseModal>
  );
};

export default MessageModal;
