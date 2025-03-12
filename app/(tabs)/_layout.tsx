import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/Colors";
import { View, Text } from "@/components/Themed";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import {
	ProfileToggleProvider,
	useProfileToggle,
} from "@/services/ProfileToggleContext";

// You can explore the built-in icon families and icons on the web at https://iconns.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function HeaderLeftButton() {
	const { toggleImporter } = useProfileToggle();
	const colorScheme = useColorScheme().colorScheme;

	return (
		<Pressable
			onPress={() => {
				toggleImporter();
				if (Platform.OS !== "web") {
					Haptics.selectionAsync();
				}
			}}
		>
			{({ pressed }) => (
				<FontAwesome
					name="arrows-h"
					size={25}
					color={Colors[colorScheme ?? "light"].text}
					className="mr-4"
					style={{
						opacity: pressed ? 0.5 : 1,
					}}
				/>
			)}
		</Pressable>
	);
}

export default function TabLayout() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<ProfileToggleProvider>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
					headerShown: useClientOnlyValue(false, true),
					tabBarStyle: {
						backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
					},
					headerStyle: {
						backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
					},
				}}
				screenListeners={{
					tabPress: () => {
						if (Platform.OS === "web") return;
						Haptics.selectionAsync();
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Home",
						tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
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
											color={Colors[colorScheme ?? "light"].text}
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
					name="igprofile"
					options={{
						title: "Profile",
						headerTitle: () => (
							<View className="flex flex-row items-center dark:bg-oxford-700">
								<FontAwesome
									name="instagram"
									size={24}
									color={colorScheme ? "white" : "black"}
								/>
								<Text className="text-lg ml-2.5">Instagram Profile</Text>
							</View>
						),
						tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
						headerRight: () => <HeaderLeftButton />,
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						title: "Settings",
						tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
					}}
				/>
			</Tabs>
		</ProfileToggleProvider>
	);
}
