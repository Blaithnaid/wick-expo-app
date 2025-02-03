/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
	Text as DefaultText,
	View as DefaultView,
	SafeAreaView as DefaultSafeAreaView,
	ScrollView as DefaultScrollView,
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
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme().colorScheme ?? "light";
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}

export function Text(props: TextProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	return (
		<DefaultText
			className="color-black dark:color-white"
			style={style}
			{...otherProps}
		/>
	);
}

export function ThemedView(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	return (
		<DefaultView className="bg-white dark:bg-pink-500" {...otherProps} />
	);
}

export function SafeAreaView(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background"
	);

	return (
		<DefaultSafeAreaView
			className="bg-white dark:bg-pink-500"
			style={[{ backgroundColor }, style]}
			{...otherProps}
		/>
	);
}

export function ScrollView(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background"
	);

	return (
		<DefaultScrollView
			style={[{ backgroundColor }, style]}
			{...otherProps}
		/>
	);
}
