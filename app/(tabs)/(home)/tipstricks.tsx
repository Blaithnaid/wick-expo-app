import {
	ScrollView,
	Image,
	Pressable,
	Linking,
	Animated,
	Dimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme"; // Import the color scheme hook
import { Text, View } from "@/components/Themed";
import { collection, getDocs } from "firebase/firestore";
import { useFirebaseContext } from "@/services/FirebaseProvider";

const { width } = Dimensions.get("window"); // Get screen width for responsive design

function getYouTubeThumbnail(url: string): string {
	// Extract the video ID from the YouTube URL
	const match = url.match(
		/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
	);
	const videoId = match ? match[1] : null;
	return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : "";
}

const bestTimesToPost = [
	{
		platform: "TikTok",
		times: {
			Monday: "10 AM - 12 PM",
			Tuesday: "2 PM - 4 PM",
			Wednesday: "1 PM - 3 PM",
			Thursday: "4 PM - 6 PM",
			Friday: "6 PM - 8 PM",
			Saturday: "9 AM - 11 AM",
			Sunday: "3 PM - 5 PM",
		},
	},
	{
		platform: "YouTube",
		times: {
			Monday: "12 PM - 2 PM",
			Tuesday: "3 PM - 5 PM",
			Wednesday: "5 PM - 7 PM",
			Thursday: "6 PM - 8 PM",
			Friday: "7 PM - 9 PM",
			Saturday: "10 AM - 12 PM",
			Sunday: "4 PM - 6 PM",
		},
	},
	{
		platform: "Instagram",
		times: {
			Monday: "9 AM - 11 AM",
			Tuesday: "11 AM - 1 PM",
			Wednesday: "2 PM - 4 PM",
			Thursday: "3 PM - 5 PM",
			Friday: "5 PM - 7 PM",
			Saturday: "8 AM - 10 AM",
			Sunday: "6 PM - 8 PM",
		},
	},
];

export default function TipsAndTricks() {
	const blogAnimations = useRef([
		new Animated.Value(1),
		new Animated.Value(1),
		new Animated.Value(1),
	]).current;

	const colorScheme = useColorScheme(); // Detect system theme (light or dark)

	type Video = {
		tip: string;
		videoUrl: string;
		thumbnail: string;
	};

	type GroupedTip = {
		platform: string;
		videos: Video[];
	};

	const [groupedTips, setGroupedTips] = useState<GroupedTip[]>([]);
	const [loadingTips, setLoadingTips] = useState(true);
	const { myFS } = useFirebaseContext();
	const [animations, setAnimations] = useState<any[]>([]);

	useEffect(() => {
		const fetchTips = async () => {
			if (!myFS) return;
			setLoadingTips(true);
			try {
				const tipsCol = collection(myFS, "tips");
				const tipsSnap = await getDocs(tipsCol);
				const tipsArr = tipsSnap.docs.map((doc) => {
					const data = doc.data();
					return {
						tip: data.title,
						videoUrl: data.youtubeUrl,
						thumbnail: getYouTubeThumbnail(data.youtubeUrl),
						platform: data.platform,
					};
				});
				// Group by platform
				const grouped: Record<string, any[]> = {};
				tipsArr.forEach((tip) => {
					if (!grouped[tip.platform]) grouped[tip.platform] = [];
					grouped[tip.platform].push({
						tip: tip.tip,
						videoUrl: tip.videoUrl,
						thumbnail: tip.thumbnail,
					});
				});
				const groupedArr = Object.entries(grouped).map(([platform, videos]) => ({
					platform,
					videos,
				}));
				setGroupedTips(groupedArr);
				setAnimations(
					groupedArr.map(() => ({
						translateY: new Animated.Value(50),
						opacity: new Animated.Value(0),
					}))
				);
			} catch (e) {
				setGroupedTips([]);
				setAnimations([]);
			}
			setLoadingTips(false);
		};
		fetchTips();
	}, [myFS]);

	useEffect(() => {
		if (!animations.length) return;
		const animationsList = animations.map((anim, index) =>
			Animated.parallel([
				Animated.timing(anim.translateY, {
					toValue: 0,
					duration: 600,
					delay: index * 200,
					useNativeDriver: true,
				}),
				Animated.timing(anim.opacity, {
					toValue: 1,
					duration: 600,
					delay: index * 200,
					useNativeDriver: true,
				}),
			])
		);

		Animated.stagger(150, animationsList).start();
	}, [animations]);

	const handlePressIn = (index: number) => {
		Animated.spring(blogAnimations[index], {
			toValue: 1.05,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = (index: number) => {
		Animated.spring(blogAnimations[index], {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	const textColor =
		colorScheme.colorScheme === "dark" ? "#ffffff" : "#000000";

	if (loadingTips) {
		return (
			<View className="flex-1 w-full items-center justify-center bg-white dark:bg-oxford-500">
				<Text className="text-lg text-gray-900 dark:text-white">
					Loading tips...
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 w-full items-center justify-center bg-white dark:bg-oxford-500">
			<ScrollView
				className="w-full py-4 bg-white web:mx-auto web:max-w-5xl dark:bg-oxford-500"
				contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
			>
				{/* Grouped Tips */}
				{groupedTips.map((group, index) => (
					<View className="mb-6 w-full" key={index}>
						<Text className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
							{group.platform}
						</Text>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								flexDirection: "row",
								alignItems: "flex-start", // Ensure proper alignment
								paddingHorizontal: 16,
							}}
						>
							{group.videos.map((video, idx) => (
								<Animated.View
									className="bg-gray-200 dark:bg-oxford-600 overflow-hidden"
									key={idx}
									style={{
										transform: [
											{
												translateY:
													animations[index]?.translateY || 0,
											},
										],
										opacity: animations[index]?.opacity || 1,
										marginRight:
											idx === group.videos.length - 1
												? 0
												: 16, // Remove margin for the last video
										alignItems: "center",
										borderRadius: 12, // Increased from 8
										width: 200,
										shadowColor: "#000",
										shadowOffset: { width: 0, height: 2 },
										shadowOpacity: 0.3,
										shadowRadius: 4,
										elevation: 5,
									}}
								>
									<Image
										source={{ uri: video.thumbnail }}
										style={{
											width: 192,
											height: 112,
											resizeMode: "cover",
										}}
									/>
									<View className="w-full p-4 flex-1 justify-between dark:bg-oxford-600">
										{/* Title Container with Fixed Height */}
										<View className="min-h-10 bg-gray-200 dark:bg-oxford-600 justify-center">
											<Text
												style={{
													fontSize: 16,
													fontWeight: "bold",
													textAlign: "center",
													marginBottom: 8,
													color: textColor,
												}}
											>
												{video.tip}
											</Text>
										</View>
										<Pressable
											onPress={() =>
												Linking.openURL(video.videoUrl)
											}
											style={{
												backgroundColor: "#6F6DB2", // Changed button color to #6F6DB2
												borderRadius: 8,
												paddingVertical: 8,
												paddingHorizontal: 16,
											}}
										>
											<Text
												style={{
													color: "white",
													fontWeight: "bold",
													textAlign: "center",
												}}
											>
												🎥 Watch Video
											</Text>
										</Pressable>
									</View>
								</Animated.View>
							))}
						</ScrollView>
					</View>
				))}

				{/* Recommended Blogs */}
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						textAlign: "center",
						marginTop: 24,
						marginBottom: 16,
						color: textColor,
					}}
				>
					📝 Recommended Blogs
				</Text>

				<View
					style={{
						width: "100%",
						alignItems: "center",
						marginBottom: 24,
					}}
				>
					{/* Blog 1 */}
					<Animated.View
						style={{ transform: [{ scale: blogAnimations[0] }] }}
					>
						<Pressable
							onPress={() =>
								Linking.openURL(
									"https://www.sprinklr.com/blog/how-to-drive-organic-growth-on-social-media/"
								)
							}
							onPressIn={() => handlePressIn(0)}
							onPressOut={() => handlePressOut(0)}
							style={{
								backgroundColor: "#007bff", // Original blue color
								borderRadius: 8,
								padding: 16,
								marginBottom: 16,
								width: width * 0.9,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontWeight: "bold",
									fontSize: 16,
								}}
							>
								📈 How to Drive Organic Growth on Social Media
							</Text>
						</Pressable>
					</Animated.View>

					{/* Blog 2 */}
					<Animated.View
						style={{ transform: [{ scale: blogAnimations[1] }] }}
					>
						<Pressable
							onPress={() =>
								Linking.openURL(
									"https://www.forbes.com/sites/nicolesmith/2024/08/19/the-art-of-engagement-key-to-rapidly-growing-social-media-following/"
								)
							}
							onPressIn={() => handlePressIn(1)}
							onPressOut={() => handlePressOut(1)}
							style={{
								backgroundColor: "#28a745", // Original green color
								borderRadius: 8,
								padding: 16,
								marginBottom: 16,
								width: width * 0.9,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontWeight: "bold",
									fontSize: 16,
								}}
							>
								🔥 The Art of Engagement for Social Media Growth
							</Text>
						</Pressable>
					</Animated.View>

					{/* Blog 3 */}
					<Animated.View
						style={{ transform: [{ scale: blogAnimations[2] }] }}
					>
						<Pressable
							onPress={() =>
								Linking.openURL("https://buffer.com/resources/")
							}
							onPressIn={() => handlePressIn(2)}
							onPressOut={() => handlePressOut(2)}
							style={{
								backgroundColor: "#6f42c1", // Original purple color
								borderRadius: 8,
								padding: 16,
								width: width * 0.9,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontWeight: "bold",
									fontSize: 16,
								}}
							>
								📊 Buffer Resources for Social Media Growth
							</Text>
						</Pressable>
					</Animated.View>
				</View>

				{/* Best Times to Post Carousel */}
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						textAlign: "center",
						marginTop: 24,
						marginBottom: 16,
						color: textColor,
					}}
				>
					📅 Best Times to Post
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						flexDirection: "row",
						paddingHorizontal: 16,
						marginBottom: 24,
					}}
				>
					{bestTimesToPost.map((platform, index) => (
						<View
							className="web:max-w-xl"
							key={index}
							style={{
								backgroundColor:
									colorScheme.colorScheme === "dark"
										? "#1a1a1a"
										: "#ffffff",
								borderRadius: 16,
								padding: 20,
								marginRight: 16,
								width: width * 0.8,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.2,
								shadowRadius: 8,
								elevation: 8,
								borderWidth: 1,
								borderColor:
									colorScheme.colorScheme === "dark"
										? "#333"
										: "#eee",
							}}
						>
							{/* Platform Header with Icon */}
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 16,
									backgroundColor:
										platform.platform === "TikTok"
											? "#00F2EA"
											: platform.platform === "Instagram"
											? "#E4405F"
											: "#FF0000",
									padding: 12,
									borderRadius: 12,
								}}
							>
								<Text
									style={{
										fontSize: 20,
										fontWeight: "bold",
										color: "white",
										textShadowColor: "rgba(0, 0, 0, 0.3)",
										textShadowOffset: {
											width: 1,
											height: 1,
										},
										textShadowRadius: 3,
									}}
								>
									{platform.platform === "TikTok"
										? "🎵 "
										: platform.platform === "Instagram"
										? "📸 "
										: "▶ "}
									{platform.platform}
								</Text>
							</View>

							{/* Time Slots with Better Design */}
							{Object.entries(platform.times).map(
								([day, time], idx) => (
									<View
										key={idx}
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											backgroundColor:
												colorScheme.colorScheme ===
												"dark"
													? "#2a2a2a"
													: "#f8f8f8",
											padding: 12,
											borderRadius: 8,
											marginBottom: 8,
											borderLeftWidth: 4,
											borderLeftColor:
												platform.platform === "TikTok"
													? "#00F2EA"
													: platform.platform ===
													  "Instagram"
													? "#E4405F"
													: "#FF0000",
										}}
									>
										<Text
											style={{
												fontSize: 16,
												fontWeight: "600",
												color: textColor,
											}}
										>
											{day}
										</Text>
										<View
											style={{
												backgroundColor:
													colorScheme.colorScheme ===
													"dark"
														? "#3a3a3a"
														: "#e8e8e8",
												paddingHorizontal: 12,
												paddingVertical: 4,
												borderRadius: 12,
											}}
										>
											<Text
												style={{
													fontSize: 14,
													color:
														platform.platform ===
														"TikTok"
															? "#00F2EA"
															: platform.platform ===
															  "Instagram"
															? "#E4405F"
															: "#FF0000",
													fontWeight: "600",
												}}
											>
												{time}
											</Text>
										</View>
									</View>
								)
							)}
						</View>
					))}
				</ScrollView>
			</ScrollView>
		</View>
	);
}
