import {
	View,
	Text,
	Pressable,
	Linking,
	ScrollView,
	Platform,
	Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { Stack, router } from "expo-router";
import { ref, getDownloadURL } from "firebase/storage";
import { useFirebaseContext } from "@/services/FirebaseProvider";
import * as FileSystem from "expo-file-system";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import Head from "expo-router/head";

interface Filter {
	title: string;
	videoPath: string;
	tiktokLink: string;
}

interface FilterWithVideo extends Filter {
	videoUrl?: string | null;
	needsDownload?: boolean;
}

const filters: Filter[] = [
	{
		title: "Guess The Country",
		videoPath: "filters/guesscountrydemodemo.mp4",
		tiktokLink: "https://vm.tiktok.com/ZNd29DgSQ/",
	},
	{
		title: "Anime Tournament",
		videoPath: "filters/thisorthatdemodemo.mp4",
		tiktokLink: "https://vm.tiktok.com/ZNd29J6yk/",
	},
	{
		title: "Colourful Hair",
		videoPath: "filters/colourfulhairdemo.mp4",
		tiktokLink: "https://vm.tiktok.com/ZNd29LT32/",
	},
	{
		title: "Blind Ranking",
		videoPath: "filters/songpickdemodemo.mp4",
		tiktokLink: "https://vm.tiktok.com/ZNd2qFFyQ/",
	},
	{
		title: "Beard Removal Filter",
		videoPath: "filters/beardremovaldemo.mp4",
		tiktokLink: "https://vm.tiktok.com/ZNd2VobJC/", // Fixed the double 'h' at the beginning
	},
	{
		title: "Gradient Hair Filter",
		videoPath: "filters/gradienthaircolourdemo.mp4",
		tiktokLink: "https://vm.tiktok.com/ZNd29Fyg7/",
	},
];

export default function TikTokFiltersPage() {
	const { myStorage } = useFirebaseContext();
	const [filterVideos, setFilterVideos] = useState<FilterWithVideo[]>(filters);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
	const [showQRModal, setShowQRModal] = useState(false);

	useEffect(() => {
		const initializeVideos = async () => {
			try {
				if (!myStorage) {
					console.error("Firebase Storage is not initialized");
					setError("Firebase Storage is not initialized");
					setLoading(false);
					return;
				}

				const updatedFilters = await Promise.all(
					filters.map(async (filter): Promise<FilterWithVideo> => {
						if (filter.videoPath) {
							try {
								const fileName = filter.videoPath.replace(/\//g, "_");
								const localUri = `${FileSystem.cacheDirectory}${fileName}`;
								const fileInfo = await FileSystem.getInfoAsync(localUri);

								if (fileInfo.exists) {
									return { ...filter, videoUrl: localUri };
								} else {
									const videoRef = ref(myStorage, filter.videoPath);
									const videoUrl = await getDownloadURL(videoRef);

									// Start background download, but return streaming URL immediately
									FileSystem.downloadAsync(videoUrl, localUri).catch((err) =>
										console.error(
											`Background download failed for ${filter.title}:`,
											err,
										),
									);

									return { ...filter, videoUrl: videoUrl };
								}
							} catch (error) {
								console.error(
									`Error getting video for ${filter.title}:`,
									error,
								);
								return { ...filter, videoUrl: null };
							}
						}
						return filter;
					}),
				);

				setFilterVideos(updatedFilters);
				setLoading(false);
			} catch (error) {
				console.error("Error initializing videos:", error);
				setError(
					error instanceof Error ? error.message : "Error loading filters",
				);
				setLoading(false);
			}
		};

		initializeVideos();
	}, [myStorage]);

	const openQRModal = (filter: Filter) => {
		setSelectedFilter(filter);
		setShowQRModal(true);
	};

	// Put filters into pairs
	const rows: FilterWithVideo[][] = [];
	for (let i = 0; i < filterVideos.length; i += 2) {
		rows.push(filterVideos.slice(i, i + 2));
	}

	if (loading) {
		return (
			<View className="flex-1 bg-white dark:bg-oxford-500 justify-center items-center">
				<Text className="text-lg text-gray-900 dark:text-white">
					Loading filters...
				</Text>
				{error && (
					<Text className="text-red-500 mt-2 text-center px-4">{error}</Text>
				)}
			</View>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					...(Platform.OS === "ios"
						? {
								headerLeft: () => (
									<View className="flex-row">
										<Pressable onPress={() => router.back()}>
											<Text className="color-iguana-400 dark:color-iguana-400">
												Back
											</Text>
										</Pressable>
									</View>
								),
							}
						: {}),
				}}
			/>
			<ScrollView
				className="bg-white dark:bg-oxford-500"
				contentContainerStyle={{ padding: 16 }}
			>
				{Platform.OS === "web" ? (
					<Head>
						<title>TikTok Filters | Wick</title>
					</Head>
				) : null}

				<View className="max-w-5xl mx-auto">
					{/* Header Section */}
					<Text className="text-3xl font-bold mb-6 text-center animate-pulse text-gray-900 dark:text-white">
						🎬 Try Our TikTok Filters!
					</Text>
					<Text className="text-lg text-center mb-4 text-gray-800 dark:text-gray-200">
						Click on the filters below to try them out on TikTok!
					</Text>
					<Text className="text-sm text-center mb-6 text-gray-700 dark:text-gray-300">
						Note: Make sure you have the TikTok app installed to use these
						filters.
					</Text>

					{/* Render filters in pairs */}
					{rows.map((pair, rowIndex) => (
						<View key={rowIndex} className="flex-row justify-between mb-6">
							{pair.map((filter, colIndex) => (
								<View
									key={colIndex}
									className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
									style={{
										width: Platform.OS === "web" ? "48%" : "48%",
										maxWidth: 400,
									}}
								>
									{/* Filter Video Preview */}
									{filter.videoUrl ? (
										<Video
											source={{ uri: filter.videoUrl }}
											style={{
												width: "100%",
												height: Platform.OS === "web" ? 450 : 256,
												borderRadius: 12,
												marginBottom: 12,
											}}
											resizeMode={
												Platform.OS === "web"
													? ResizeMode.COVER
													: ResizeMode.CONTAIN
											}
											shouldPlay
											isLooping
											isMuted
											onError={(error) => console.error("Video error:", error)}
											onLoad={() => console.log("Video loaded successfully")}
										/>
									) : (
										// Show loading state instead of placeholder
										<View
											style={{
												width: "100%",
												height: Platform.OS === "web" ? 450 : 256,
												borderRadius: 12,
												marginBottom: 12,
												backgroundColor: "#E5E7EB",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Text className="text-gray-500 dark:text-gray-400">
												Loading video...
											</Text>
										</View>
									)}

									{/* Filter Title */}
									<Text className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white">
										{filter.title}
									</Text>

									{/* Buttons Row */}
									<View className="flex-row justify-between items-center">
										<Pressable
											onPress={() => Linking.openURL(filter.tiktokLink)}
											className="bg-pink-600 dark:bg-pink-500 rounded-lg p-2.5 flex-1 mr-2 flex-row justify-center items-center"
										>
											<Text className="text-white text-center font-bold text-sm">
												🎯 Try on TikTok
											</Text>
										</Pressable>

										<Pressable
											onPress={() => openQRModal(filter)}
											className="bg-white dark:bg-gray-100 rounded-lg p-2.5 w-10 h-10 justify-center items-center"
										>
											<Ionicons name="qr-code" size={20} color="#333" />
										</Pressable>
									</View>
								</View>
							))}
							{/* If last row has only 1 item, fill space to align nicely */}
							{pair.length === 1 && (
								<View style={{ width: "48%", maxWidth: 400 }} />
							)}
						</View>
					))}
				</View>

				{/* QR Code Modal */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={showQRModal}
					onRequestClose={() => setShowQRModal(false)}
				>
					<Pressable
						className="flex-1 justify-center items-center bg-black/50"
						onPress={() => setShowQRModal(false)}
					>
						<View className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80 items-center">
							<Text className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
								{selectedFilter?.title}
							</Text>

							<View
								className="bg-white p-6 rounded-lg mb-4"
								style={{ backgroundColor: "#ffffff" }}
							>
								{selectedFilter && (
									<QRCode
										value={selectedFilter.tiktokLink}
										size={200}
										backgroundColor="white"
										color="black"
									/>
								)}
							</View>

							<Text className="text-sm text-center mb-4 text-gray-700 dark:text-gray-300">
								Scan this QR code with your phone to open the filter in TikTok
							</Text>

							<Pressable
								onPress={() => setShowQRModal(false)}
								className="bg-pink-600 dark:bg-pink-500 rounded-lg p-3 w-full"
							>
								<Text className="text-white text-center font-bold">Close</Text>
							</Pressable>
						</View>
					</Pressable>
				</Modal>
			</ScrollView>
		</>
	);
}
