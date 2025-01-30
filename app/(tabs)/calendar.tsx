import { StyleSheet } from "react-native";
import { Text, ThemedView } from "@/components/Themed";

export default function CalendarScreen() {
	return (
		<ThemedView className="flex-1 items-center justify-center h-full w-full"></ThemedView>
	);
}

const styles = StyleSheet.create({
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
