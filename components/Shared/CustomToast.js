import { Dimensions, Text } from "react-native";
import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSequence,
  withDelay,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "react-native-heroicons/outline";
const Toast = forwardRef(({}, ref) => {
  const toastTopAnimation = useSharedValue(-100);
  const [showing, setShowing] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastText, setToastText] = useState("");
  const [toastDuration, setToastDuration] = useState(0);
  const TOP_VALUE = 50;
  const SCREEN_WIDTH = Dimensions.get("screen").width;
  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [show]
  );

  const show = useCallback(
    ({ type, text, duration }) => {
      setShowing(true);
      setToastType(type);
      setToastText(text);
      setToastDuration(duration);
      toastTopAnimation.value = withSequence(
        withTiming(TOP_VALUE),
        withDelay(
          duration,
          withTiming(-100, null, (finish) => {
            if (finish) {
              runOnJS(setShowing)(false);
            }
          })
        )
      );
    },
    [TOP_VALUE, toastTopAnimation]
  );

  const animatedTopStyles = useAnimatedStyle(() => {
    return {
      top: toastTopAnimation.value,
      transform: [{ translateX: -(SCREEN_WIDTH * 0.4) }],
      elevation: 60,
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = toastTopAnimation.value;
    },
    onActive: (event, ctx) => {
      if (event.translationY < 100) {
        toastTopAnimation.value = withSpring(ctx.startY + event.translationY, {
          damping: 600,
          stiffness: 100,
        });
      }
    },
    onEnd: (event) => {
      if (event.translationY < 0) {
        toastTopAnimation.value = withTiming(-100, null, (finish) => {
          if (finish) {
            runOnJS(setShowing)(false);
          }
        });
      } else if (event.translationY > 0) {
        toastTopAnimation.value = withSequence(
          withTiming(TOP_VALUE),
          withDelay(
            toastDuration,
            withTiming(-100, null, (finish) => {
              if (finish) {
                runOnJS(setShowing)(false);
              }
            })
          )
        );
      }
    },
  });

  return (
    <>
      {showing && (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            className={`${
              toastType == "success"
                ? "bg-green-200/90 border-green-500"
                : toastType == "warning"
                ? "bg-yellow-100/90 border-yellow-500"
                : "bg-red-200/90 border-red-600"
            } border w-4/5  flex-row items-center rounded-2xl  px-3 py-3 space-x-2 absolute left-1/2 z-50`}
            style={{
              ...animatedTopStyles,
            }}
          >
            {toastType == "success" && (
              <CheckBadgeIcon size={30} color="green" />
            )}
            {toastType == "warning" && (
              <ExclamationTriangleIcon size={30} color="orange" />
            )}
            {toastType == "error" && (
              <ExclamationCircleIcon size={30} color="red" />
            )}
            <Text
              className={`${
                toastType == "success"
                  ? "text-green-600"
                  : toastType == "warning"
                  ? "text-yellow-600"
                  : "text-red-700"
              }`}
            >
              {toastText}
            </Text>
          </Animated.View>
        </PanGestureHandler>
      )}
    </>
  );
});

export default Toast;
