import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { ScrollView, Pressable } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthContext } from "@/services/AuthProvider";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
	const colorScheme = useColorScheme().colorScheme;
	const auth = useAuthContext();

	const tasks = [
		{ name: "Brand deal", due: new Date(), color: "bg-purple-500" },
		{ name: "Instructional video", due: new Date(), color: "bg-blue-500" },
		{ name: "Room tour", due: new Date(), color: "bg-yellow-500" },
	];

	const monthlyProgress = [
		{ name: "Done", value: 22, color: "bg-green-400" },
		{ name: "In Progress", value: 7, color: "bg-orange-400" },
	];

	const recommendedCards = [
		{ name: "Tips & Tricks", color: "bg-purple-500" },
		{ name: "Monetisation", color: "bg-indigo-500" },
		{ name: "Analytics", color: "bg-red-500", route: "(analytics)" },
	];

	return (
		<ScrollView
			className="w-full py-4 bg-white dark:bg-oxford-500"
			contentContainerClassName="items-center"
		>
			{/* Header Section */}
			<View className="flex-row items-center justify-between w-full max-w-md mt-px mb-4">
				<View className="flex-row items-center">
					<View className="bg-gray-300 dark:bg-slate-900 overflow-hidden rounded-full w-14 h-14 ml-2 flex items-center justify-center self-center">
						{auth.user?.photoURL ? (
							<Image
								source={{ uri: auth.user?.photoURL }}
								style={{ height: "100%", width: "100%" }}
							/>
						) : (
							<FontAwesome
								name="user"
								size={56}
								color={"gray"}
								className="rounded-full"
							/>
						)}
					</View>
					<View className="ml-3 flex flex-row">
						<Text className="text-gray-500 text-xl">Hello, </Text>
						<Text className="text-xl font-semibold text-indigo-600">
							{auth.profile?.displayName || "Username"}!
						</Text>
					</View>
				</View>
				<FontAwesome
					size={24}
					name="bell"
					color={colorScheme === "dark" ? "white" : "gray"}
					className="mr-4"
				/>
			</View>

			<View className="w-[90%] h-1 bg-gray-200 dark:bg-gray-600 rounded-xl mt-1.5 mb-4" />
			<Text className="w-[90%] text-lg font-semibold mb-1.5">
				Recommended for You
			</Text>
			<View className="flex-row flex-wrap justify-center w-full px-2 gap-2">
				{/* Trend Button */}
				<Link href="/trends" asChild>
					<Pressable
					className="bg-blue-500 p-5 rounded-xl items-center shadow-lg w-[48%]"
					style={{ elevation: 10 }}
					>
					<Text className="text-white text-lg font-bold">Trends</Text>
					</Pressable>
				</Link>

				{/* Your mapped dynamic cards */}
				{recommendedCards.map((card, index) => (
					<Link asChild key={index} href={`/${card.route || card.name}`}>
					<Pressable
						key={index}
						className={`${card.color} p-5 rounded-xl items-center shadow-lg w-[48%]`}
						style={{ elevation: 10 }}
					>
						<Text className="text-white text-lg font-bold">{card.name}</Text>
					</Pressable>
					</Link>
				))}
				</View>

			<View className="w-[90%] h-1 bg-gray-200 dark:bg-gray-600 rounded-xl mt-6 mb-4" />
			{/* Task Progress Section */}
			<Text className="w-[90%] text-lg font-semibold -mb-px">In progress</Text>
			<View className="mt-3 w-full max-w-md gap-3 px-5">
				{tasks.map((task, index) => (
					<View
						key={index}
						className={`relative flex flex-row items-center justify-between ${task.color} py-2 px-3 rounded-xl shadow-lg shadow-${task.color} transform scale-105`}
						style={{ elevation: 10 }}
					>
						<View className="bg-transparent dark:bg-transparent flex flex-col">
							<Text className="text-white text-lg font-bold">{task.name}</Text>
							<View className="bg-transparent dark:bg-transparent text-white flex flex-row mt-2 text-sm">
								<FontAwesome
									size={14}
									name="clock-o"
									color={"white"}
									className="mr-1"
								/>
								<Text className="text-white inline font-medium -translate-y-0.5">
									{task.due.toLocaleDateString("en-US", {
										weekday: "long",
										day: "numeric",
										month: "long",
									})}
								</Text>
							</View>
						</View>
						<FontAwesome
							size={24}
							name="chevron-right"
							color={"white"}
							className="mr-px"
						/>
					</View>
				))}
			</View>

			<View className="w-[90%] h-1 bg-gray-200 dark:bg-gray-600 rounded-xl mt-6 mb-4" />
			<Text className="w-[90%] text-lg font-semibold mb-2">
				Monthly progress
			</Text>
			<View className="flex-row flex-wrap justify-between px-4 mb-8 w-full">
				{monthlyProgress.map((item, index) => (
					<View
						key={index}
						className={`${item.color} p-5 rounded-xl items-center shadow-lg w-[49%]`}
						style={{ elevation: 10 }}
					>
						<Text className="text-white text-2xl font-bold">{item.value}</Text>
						<Text className="text-white">{item.name}</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);
}
