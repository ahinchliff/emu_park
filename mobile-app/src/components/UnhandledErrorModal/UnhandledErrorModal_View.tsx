import React from "react";
import moment from "moment";
import { Text } from "react-native";
import BaseModal from "../Modal/BaseModal_View";
import HorizontalSpacer from "../HorizontalSpacer";

type Error = {
  code?: string;
  message?: string;
};

type Props = {
  isShown: boolean;
  onClose(): void;
  error: Error | undefined;
};

const UnhandledErrorModal: React.FC<Props> = (props) => {
  if (!props.isShown || !props.error) {
    return null;
  }
  return (
    <BaseModal
      show={props.isShown}
      // title="oops, something went wrong!"
      onClose={props.onClose}
    >
      <Text>
        An unexpected error has occured. Please try again. If the problem
        persists please contact us with the details below.
      </Text>
      <HorizontalSpacer height={20} />
      <Text style={{ fontSize: 10 }}>Time: {moment.utc().format()} UTC</Text>
      {props.error.code && (
        <Text style={{ fontSize: 10 }}>Code: {props.error.code}</Text>
      )}
      <Text style={{ fontSize: 10 }}>Message: {props.error.message}</Text>
    </BaseModal>
  );
};

export default UnhandledErrorModal;
