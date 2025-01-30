import { StyleSheet } from "react-native";
import { Text, ThemedView } from "@/components/Themed";

export default function CalendarScreen() {
	return (
		<ThemedView className="flex-1 items-center justify-center">
			<Text className="text-xl font-bold text-white">Calendar</Text>
			<ThemedView
				className="my-8 h-px w-[80%]"
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
