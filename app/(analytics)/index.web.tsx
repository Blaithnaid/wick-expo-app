import { SafeAreaView, Text, View } from "@/components/Themed";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

export default function AnalyticsScreen() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<>
			<SafeAreaView className="flex-1 h-full w-full items-center justify-center">
				<View className="flex-1 items-center justify-center px-5 flex">
					<FontAwesome
						name="chart-pie"
						size={80}
						color={colorScheme === "dark" ? "white" : "black"}
					/>
					<View className="mt-4 mb-3 h-[2px] rounded-full w-[55%] bg-slate-400" />
					<Text className="text-xl text-center w-2/3">
						Send a message to start chatting with Wickbot!
					</Text>
					<Text className="text-lg text-center w-3/4 mt-4">
						Click the icon in the top right to get some tips!
					</Text>
				</View>
			</SafeAreaView>
		</>
	);
}
