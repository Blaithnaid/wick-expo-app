import { StyleSheet } from "react-native";
import { Text, TView } from "@/components/Themed";

export default function CalendarScreen() {
	return (
		<TView className="flex-1 items-center justify-center h-full w-full"></TView>
	);
}

const styles = StyleSheet.create({
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
