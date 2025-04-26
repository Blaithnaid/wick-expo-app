import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor:
						Colors[colorScheme ?? "light"].headerBackground,
					// Note: This is the header height that nested stacks should match
					// Default React Navigation header height is applied here
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Home",
					headerShown: true,
				}}
			/>
		</Stack>
	);
}
