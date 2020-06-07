import { useRef } from "react";
import { Animated } from "react-native";
import { variables } from "../styles";

const useAnimatedValueOnScroll = (): [
  React.MutableRefObject<Animated.Value>,
  (...args: any[]) => void
] => {
  const scrollDistance = new Animated.Value(0);
  const scrollDistanceRef = useRef(scrollDistance);

  const onScroll = Animated.event([
    {
      nativeEvent: {
        contentOffset: { y: scrollDistanceRef.current },
      },
    },
  ]);

  return [scrollDistanceRef, onScroll];
};

export default useAnimatedValueOnScroll;
