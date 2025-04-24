import { SafeAreaView, Text, View } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ScrollView, Pressable } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/Colors";

export default function AnalyticsScreen() {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [tokenInput, setTokenInput] = useState<string>("");
	const [overviewFigures, setOverviewFigures] = useState<
		{ title: string; figure: number; background: string }[]
	>([
		{
			title: "Total views",
			figure: 1633,
			background: "bg-red-400 dark:bg-red-600",
		},
		{
			title: "Followers online now",
			figure: 427,
			background: "bg-green-400 dark:bg-green-600",
		},
		{ title: "Comments", figure: 14, background: "bg-sky-400 dark:bg-sky-600" },
		{
			title: "Followers +/-",
			figure: 61,
			background: "bg-orange-400 dark:bg-orange-600",
		},
	]);
	const { showActionSheetWithOptions } = useActionSheet();
	const colorScheme = useColorScheme().colorScheme;
	const options = ["Clear token", "Cancel"];
	const destructiveButtonIndex = 0;
	const cancelButtonIndex = 1;

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

	const onPress = () => {
		showActionSheetWithOptions(
			{
				title: "Your token is: " + accessToken,
				options,
				destructiveButtonIndex,
				cancelButtonIndex,
			},
			(i?: number) => {
				switch (i) {
					case destructiveButtonIndex:
						clearToken();
						break;
					case cancelButtonIndex:
						break;
				}
			},
		);
	};

	const barData = [
		{ value: 283, label: "Mon" },
		{ value: 240, label: "Tue" },
		{ value: 350, label: "Wed" },
		{ value: 400, label: "Thu" },
		{ value: 441, label: "Fri" },
		{ value: 300, label: "Sat" },
		{ value: 500, label: "Sun" },
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
			<Stack.Screen
				options={{
					headerRight: () => (
						<View className="bg-transparent dark:bg-transparent flex-row">
							<Pressable onPress={onPress}>
								{({ pressed }) => (
									<FontAwesome
										name="key"
										size={25}
										color={Colors[colorScheme ?? "light"].text}
										style={{
											opacity: pressed ? 0.5 : 1,
										}}
									/>
								)}
							</Pressable>
						</View>
					),
				}}
			/>
			<ScrollView
				className="flex-1 h-full w-full bg-white dark:bg-oxford-500"
				contentContainerClassName="items-center justify-center"
			>
				<View
					style={{ alignItems: "center" }}
					className="w-full px-6 flex flex-col items-center justify-center"
				>
					<Text className="text-xl font-bold mt-5 mb-1.5 ml-2 w-full text-left">
						Your reach this week
					</Text>
					<View className="w-full flex justify-center items-center pt-4 py-3 border-4 border-gray-300 dark:border-gray-500 rounded-2xl bg-oxford-50 dark:bg-oxford-600">
						<View
							style={{ width: 320 }}
							className="flex justify-center pt-2 items-center bg-transparent dark:bg-transparent"
						>
							<BarChart
								barWidth={24}
								noOfSections={4}
								barBorderRadius={0}
								barBorderTopLeftRadius={4}
								barBorderTopRightRadius={4}
								dashWidth={1000}
								stepHeight={50}
								initialSpacing={10}
								endSpacing={6}
								spacing={14}
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
							<View className="flex flex-row w-2/3 rounded-lg items-center justify-center">
								<View className="w-1/2 p-2 rounded-l-lg">
									<Text className="text-center">Last Week</Text>
								</View>
								<View className="w-1/2 p-2 rounded-r-lg">
									<Text className="text-center">Last Week</Text>
								</View>
							</View>
						</View>
					</View>
					<Text className="text-xl font-bold mt-4 mb-1.5 ml-2 w-full text-left">
						Overview
					</Text>
					<View className="h-max w-full flex flex-row flex-wrap items-stretch justify-center gap-2 pt-4 pb-4 px-3 border-4 border-gray-300 dark:border-gray-500 rounded-2xl bg-oxford-50 dark:bg-oxford-600">
						{overviewFigures.map((figure, index) => (
							<View
								className={`py-6 basis-[48%] rounded-lg flex flex-col items-center justify-center ${figure.background}`}
							>
								<Text className="text-white text-4xl font-bold">
									{figure.figure}
								</Text>
								<Text className="text-white text-center text-md">
									{figure.title}
								</Text>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</>
	);
}
