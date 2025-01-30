import { StyleSheet } from "react-native";
import { Text, ThemedView } from "@/components/Themed";

export default function TabOneScreen() {
	return (
		<ThemedView className="flex-1 items-center justify-center"></ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
