import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import Colors from "@/constants/Colors";

export default function ProfilesLayout() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<Stack
			screenOptions={{
				headerShown: useClientOnlyValue(false, true),
				headerStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
				},
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="[id]" />
			<Stack.Screen
				name="[id]/followers"
				options={{
					presentation: "modal",
				}}
			/>
			<Stack.Screen
				name="[id]/following"
				options={{
					presentation: "modal",
				}}
			/>
		</Stack>
	);
}
