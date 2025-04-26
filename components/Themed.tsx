/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useState, useEffect, forwardRef } from "react";
import {
	Text as DefaultText,
	View as DefaultView,
	SafeAreaView as DefaultSafeAreaView,
	ScrollView as DefaultScrollView,
	Pressable as DefaultPressable,
	Button as DefaultButton,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
	const theme = useColorScheme().colorScheme ?? "light";
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}

//
export function Text(props: TextProps) {
	const { className, ...otherProps } = props;
	return (
		<DefaultText
			className={`text-black dark:text-white ${
				className ? className + " " : ""
			}`}
			{...otherProps}
		/>
	);
}

export function View(props: ViewProps) {
	const { className, ...otherProps } = props;
	const bgClass = className?.includes("bg-")
		? ""
		: "bg-white dark:bg-oxford-500";
	return (
		<DefaultView
			className={`${bgClass} ${className ? className + " " : ""}`}
			{...otherProps}
		/>
	);
}

export function SafeAreaView(props: ViewProps) {
	const { className, ...otherProps } = props;
	return (
		<DefaultSafeAreaView
			className={`bg-white dark:bg-oxford-500 ${
				className ? className + " " : ""
			}`}
			{...otherProps}
		/>
	);
}

export function ScrollView(props: ViewProps) {
	const { className, ...otherProps } = props;
	return (
		<DefaultScrollView
			className={`bg-white dark:bg-oxford-500 ${
				className ? className + " " : ""
			}`}
			{...otherProps}
		/>
	);
}

export const Pressable = forwardRef<
	any,
	ViewProps & { toggle?: boolean; onPress?: () => void }
>(({ className, toggle, onPress, ...otherProps }, ref) => {
	const [isPressed, setIsPressed] = useState(false);

	return (
		<DefaultPressable
			ref={ref}
			className={`${className ? className + " " : ""}`}
			style={toggle && isPressed ? { opacity: 0.5 } : undefined}
			onPressIn={() => toggle && setIsPressed(true)}
			onPressOut={() => toggle && setIsPressed(false)}
			onPress={onPress}
			{...otherProps}
		/>
	);
});
