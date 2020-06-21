import React, { ReactNode, Fragment } from "react";
import { Text } from "react-native";
import { Overlay } from "react-native-elements";
import HorizontalSpacer from "../HorizontalSpacer";
import Button from "../Button";

export type Props = {
  isShown: boolean;
  children: ReactNode;
  title?: string;
  onClose?(): void;
};

const Modal: React.FC<Props> = (props) => {
  return (
    <Overlay
      isVisible={props.isShown}
      animationType="fade"
      overlayStyle={{
        backgroundColor: "white",
        borderRadius: 10,
        width: "80%",
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Fragment>
        {props.title && (
          <Fragment>
            <Text
              style={{ fontSize: 22, fontWeight: "500", textAlign: "center" }}
            >
              {props.title}
            </Text>
            <HorizontalSpacer height={10} />
          </Fragment>
        )}
        {props.children}
        {props.onClose && (
          <Fragment>
            <HorizontalSpacer height={20} />
            <Button title="Close" onPress={props.onClose} icon="times" />
          </Fragment>
        )}
      </Fragment>
    </Overlay>
  );
};

export default Modal;
