import { View, Animated, Easing } from "react-native";
import { useRef, useEffect } from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export function LoadingDots(props: { interval: number; size: number }) {
	const dotAnims = [0, 1, 2].map(() => useRef(new Animated.Value(0)).current);
	const colorScheme = useColorScheme().colorScheme;

	useEffect(() => {
		// Use resetBeforeIteration: false to avoid pausing before looping back
		Animated.loop(
			Animated.sequence([
				Animated.timing(dotAnims[0], {
					toValue: 1,
					duration: props.interval,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
				Animated.parallel([
					Animated.timing(dotAnims[0], {
						toValue: 0,
						duration: props.interval,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
					Animated.timing(dotAnims[1], {
						toValue: 1,
						duration: props.interval,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
				]),
				Animated.parallel([
					Animated.timing(dotAnims[1], {
						toValue: 0,
						duration: props.interval,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
					Animated.timing(dotAnims[2], {
						toValue: 1,
						duration: props.interval,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
				]),
				Animated.timing(dotAnims[2], {
					toValue: 0,
					duration: props.interval,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
			]),
			{ resetBeforeIteration: false }
		).start();
	}, [dotAnims, props.interval]);

	const Dot = (index: number) => (
		<Animated.View
			key={index}
			style={{
				width: props.size,
				height: props.size,
				marginHorizontal: props.size * 0.2,
				borderRadius: props.size / 2,
				backgroundColor: colorScheme === "dark" ? "white" : "black",
				opacity: dotAnims[index],
			}}
		/>
	);

	return (
		<View className="flex flex-row justify-center items-center">
			{[0, 1, 2].map((i) => Dot(i))}
		</View>
	);
}
