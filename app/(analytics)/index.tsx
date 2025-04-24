import { SafeAreaView, Text, View } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function AnalyticsScreen() {
	const colorScheme = useColorScheme().colorScheme;
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [tokenInput, setTokenInput] = useState<string>("");

	useEffect(() => {
		const fetchAccessToken = async () => {
			const keys = await AsyncStorage.getAllKeys();
			if (keys.includes("accessToken")) {
				const token = await AsyncStorage.getItem("accessToken");
				setAccessToken(token);
			}
		};
		fetchAccessToken();
	}, []);

	const handleSend = async () => {
		setAccessToken(tokenInput);
		await AsyncStorage.setItem("accessToken", tokenInput);
	};

	const clearToken = async () => {
		setAccessToken(null);
		await AsyncStorage.removeItem("accessToken");
	};

	const barData = [
		{ value: 283, label: "Mon" },
		{ value: 240, label: "Tue", frontColor: "#FD4521" },
		{ value: 350, label: "Wed" },
		{ value: 400, label: "Thu" },
		{ value: 441, label: "Fri", frontColor: "#177AD5" },
		{ value: 300, label: "Sat" },
		{ value: 500, label: "Sun", frontColor: "#177AD5" },
	];

	if (!accessToken) {
		return (
			<>
				<SafeAreaView className="flex-1 h-full w-full items-center justify-center">
					<Text className="text-2xl">Enter your access token:</Text>
					<Input variant="outline" size="md" className="w-3/4 mt-4">
						<InputField
							className="dark:text-gray-200"
							value={tokenInput}
							onChangeText={setTokenInput}
						/>
					</Input>
					<Button
						onPress={handleSend}
						className="bg-iguana-400 dark:bg-iguana-400 mt-4"
					>
						<ButtonText className="dark:text-white">Set token</ButtonText>
					</Button>
				</SafeAreaView>
			</>
		);
	}

	return (
		<>
			<ScrollView
				className="flex-1 h-full w-full bg-white dark:bg-oxford-500"
				contentContainerClassName="items-center justify-center"
			>
				<View className="w-full px-6 flex flex-col items-center justify-center">
					<Text className="text-xl font-bold mt-3 mb-1.5 w-full text-left">
						Your reach this week
					</Text>
					<View className="w-full pl-5 pt-4 py-2 border-2 dark:border-gray-500 rounded-md bg-oxford-50 dark:bg-oxford-600">
						<BarChart
							barWidth={20}
							noOfSections={3}
							barBorderRadius={4}
							stepHeight={50}
							spacing={14}
							width={240}
							frontColor={"#E89005"}
							color={"white"}
							data={barData}
							yAxisThickness={0}
							xAxisThickness={1}
							xAxisColor={colorScheme === "dark" ? "lightgray" : "black"}
							yAxisTextStyle={
								colorScheme === "dark"
									? { color: "lightgray" }
									: { color: "black" }
							}
							xAxisLabelTextStyle={
								colorScheme === "dark"
									? {
											color: "lightgray",
											textAlign: "center",
											fontSize: 12,
										}
									: { color: "black", textAlign: "center", fontSize: 10 }
							}
						/>
					</View>
					<Text className="text-xl font-bold mt-4 mb-1.5 w-full text-left">
						Total views this week
					</Text>
					<View className="h-fit w-full flex items-center justify-center pt-4 py-8 border-2 dark:border-gray-500 rounded-md bg-oxford-50 dark:bg-oxford-600"></View>
				</View>
				<View className="w-full p-4 bg-gray-300 mt-4 dark:bg-oxford-300 h-fit items-center justify-center">
					<Text className="text-lg">Your token is: {accessToken}</Text>
					<Button
						onPress={clearToken}
						className="bg-iguana-400 dark:bg-iguana-400 mt-4"
					>
						<ButtonText className="dark:text-white text-sm">
							Clear token
						</ButtonText>
					</Button>
				</View>
			</ScrollView>
		</>
	);
}
