import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import Colors from "@/constants/Colors";

export default function CalendarLayout() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
				},
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: true }} />
		</Stack>
	);
}
