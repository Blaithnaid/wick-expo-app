import { View, Animated, Easing } from "react-native";
import { useRef, useEffect } from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export function LoadingDots(props: { interval: number; size: number }) {
	const colorScheme = useColorScheme().colorScheme;

	const dotAnimRefs = [
		useRef(new Animated.Value(0)),
		useRef(new Animated.Value(0)),
		useRef(new Animated.Value(0)),
	];
	const dotAnims = dotAnimRefs.map((ref) => ref.current);

	useEffect(() => {
		const animation = Animated.loop(
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
			{ resetBeforeIteration: false },
		);
		animation.start();
		return () => {
			try {
				if (animation && typeof animation.stop === "function") {
					animation.stop();
				}
			} catch (error) {
				console.warn("Animation cleanup error suppressed:", error);
			}
		};
	}, [props.interval, dotAnims]);

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
