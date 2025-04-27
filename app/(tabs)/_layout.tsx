import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://iconns.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
export default function TabLayout() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: useClientOnlyValue(false, true),
				tabBarStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
					...(Platform.OS === "web" && { minHeight: 60 }), // Apply minHeight only on web
				},
				headerStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
					// Note: This is the header height that nested stacks should match
					// Default React Navigation header height is applied here
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
				name="(home)"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="(calendar)"
				options={{
					headerShown: false,
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
										size={20}
										color={Colors[colorScheme ?? "light"].text}
										className="mr-4"
										style={{
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
				name="(profiles)"
				options={{
					title: "Profiles",
					headerShown: false, // Important: hide the tab header since we'll handle it in the nested stack
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="(tiktok)"
				options={{
					title: "TikTok",
					tabBarIcon: ({ color }) => <TabBarIcon name="circle" color={color} />,
				}}
			/>

		</Tabs>
	);
}
