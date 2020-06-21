import React from "react";
import { Button } from "react-native-elements";

type Props = {
  title: string;
  loading?: boolean;
  icon?: string;
  onPress(): void;
};

const ButtonView: React.FC<Props> = (props) => {
  return (
    <Button
      title={props.title}
      loading={props.loading}
      onPress={props.onPress}
      raised={true}
      containerStyle={{ width: "100%", borderRadius: 5 }}
      icon={
        props.icon
          ? {
              type: "font-awesome",
              name: props.icon,
              size: 15,
              color: "white",
            }
          : undefined
      }
      iconRight={true}
      iconContainerStyle={{
        paddingLeft: 10,
      }}
    />
  );
};

export default ButtonView;
