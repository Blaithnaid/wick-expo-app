import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

function ChatBubble({ text, isAi }: { text: string; isAi: boolean }) {
	return (
		<View style={isAi ? styles.aiBubble : styles.userBubble}>
			<Text>{text}</Text>
		</View>
	);
}

export default function ChatScreen() {
	return <View style={styles.container}></View>;
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
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	aiBubble: {
		backgroundColor: "#f0f0f0",
		padding: 10,
		borderRadius: 10,
		margin: 10,
	},
	userBubble: {
		backgroundColor: "#f0f0f0",
		padding: 10,
		borderRadius: 10,
		margin: 10,
	},
});
