import React from "react";
import { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, VirtualizedList, Appearance } from "react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://iconns.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();

	useEffect(() => {
		console.log("Layout color scheme:", colorScheme);
	});

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				headerShown: useClientOnlyValue(false, true),
			}}
			screenListeners={{
				tabPress: () => {
					Haptics.selectionAsync();
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="home" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="calendar"
				options={{
					title: "Calendar",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="calendar" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="chat"
				options={{
					title: "Chat",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="comments" color={color} />
					),
					headerRight: () => (
						<Link href="/modal" asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="info-circle"
										size={25}
										color={
											Colors[colorScheme ?? "light"].text
										}
										style={{
											marginRight: 15,
											opacity: pressed ? 0.5 : 1,
										}}
									/>
								)}
							</Pressable>
						</Link>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="gear" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
