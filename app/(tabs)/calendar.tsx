import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

export default function CalendarScreen() {
	return (
		<View className="flex-1 items-center justify-center h-full w-full"></View>
	);
}

const styles = StyleSheet.create({
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
