import { ScrollView, Platform } from "react-native";
import { Text, View } from "@/components/Themed";

export default function Trends() {
	const trends = [
		{
			platform: "TikTok",
			title: "Interactive live streams",
			description:
				"Creators will use artificial intelligence to produce original videos, music, and effects, allowing audiences to interact in real time through polls, filters, and dynamic content tailored to viewer feedback.",
		},
		{
			platform: "Instagram",
			title: "Photo Dumps",
			description:
				"Casual, messy photo carousels showing 'real' life moments often unedited, random, and authentic glimpses into someone’s week, trip, or mood, making social media feel more personal again.",
		},
		{
			platform: "YouTube",
			title: "Day in a Life Vlogs",
			description:
				"Personal, chill vlogs that feel authentic and cozy featuring everyday routines, candid thoughts, aesthetic visuals, and subtle storytelling that makes viewers feel like they’re hanging out with a friend.",
		},
		{
			platform: "Facebook",
			title: "Live Streams",
			description:
				"Streamers acting like characters and playing games to keep people engaged, often incorporating storytelling, giveaways, or challenges to boost viewer interaction and community participation.",
		},
		{
			platform: "X",
			title: "Posting Video Clips",
			description:
				"Users are posting short, snappy video clips,from hot takes to highlights and memes to gather interest and drive traffic to their profiles or larger platforms like YouTube or Patreon.",
		},
		{
			platform: "Twitch",
			title: "Streaming Games",
			description:
				"Big, high energy streams and IRL (in real life) content are trending streamers are engaging with audiences through live chats, spontaneous adventures, and creative content that blurs the line between entertainment and personal connection.",
		},
	];

	const platformColors: Record<string, string> = {
		TikTok: "bg-pink-500",
		Instagram:
			Platform.OS === "ios"
				? "bg-purple-500"
				: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500",
		YouTube: "bg-red-600",
		Facebook: "bg-blue-600",
		X: "bg-black",
		Twitch: "bg-purple-700",
	};

	const hashtagTrends = [
		"#ForYouPage",
		"#TrendingNow",
		"#ViralMoment",
		"#PhotoDump",
		"#POV",
		"#GRWM",
		"#AIContent",
		"#MemeLife",
		"#DayInTheLife",
	];

	const calendarEvents = [
		{
			date: "January 1",
			title: "New Year's Day",
			description:
				"Create content celebrating the new year, using hashtags like #NewYearsDay and #HappyNewYear.",
		},
		{
			date: "January 25",
			title: "Chinese New Year",
			description: "Share festive content, traditions, and celebrations.",
		},
		{
			date: "February 1",
			title: "Lunar New Year",
			description: "Share festive content, traditions, and celebrations.",
		},
		{
			date: "February 14",
			title: "Valentine's Day",
			description:
				"Share content celebrating love and relationships, using hashtags like #ValentinesDay and #Love.",
		},
		{
			date: "March 8",
			title: "International Women's Day",
			description:
				"Share content celebrating the women in your life, using hashtags like #IWD and #WomensDay.",
		},
		{
			date: "March 17",
			title: "St. Patrick's Day",
			description:
				"Create content celebrating Irish culture and traditions, wearing green, and using hashtags like #StPatricksDay and #LuckOfTheIrish.",
		},
		{
			date: "Mar 30",
			title: "Mother's Day (Ireland & UK)",
			description:
				"Celebrate your mum with throwbacks, reels, or heartfelt captions.",
		},
		{
			date: "April 1",
			title: "April Fool's Day",
			description:
				"Share funny pranks, jokes, and memes, using hashtags like #AprilFools and #PrankWars.",
		},
		{
			date: "April 22",
			title: "Earth Day",
			description:
				"Share eco-friendly tips, nature photos, and sustainability content.",
		},
		{
			date: "May 1",
			title: "May Day",
			description:
				"Share spring-themed content, flowers, and outdoor activities.",
		},
		{
			date: "May 4",
			title: "Star Wars Day",
			description:
				"Use 'May the 4th be with you' and star wars related memes and filters",
		},
		{
			date: "June 1-30",
			title: "Pride Month",
			description:
				"Celebrate LGBTQ+ voices, use rainbow filters, and share supportive content.",
		},
		{
			date: "June 18",
			title: "Father's Day",
			description:
				"Share content celebrating fathers and father figures, using hashtags like #FathersDay and #DadLife.",
		},
		{
			date: "July 4",
			title: "Independence Day",
			description:
				"Create content celebrating freedom and independence, using hashtags like #IndependenceDay and #FourthofJuly.",
		},
		{
			date: "August 1",
			title: "International Friendship Day",
			description:
				"Share content celebrating friendships, using hashtags like #FriendshipDay and #Besties.",
		},
		{
			date: "August 26",
			title: "National Dog Day",
			description: "Share cute dog photos, videos, and stories.",
		},
		{
			date: "September 13",
			title: "International Chocolate Day",
			description: "Share chocolate recipes, reviews, and fun facts.",
		},
		{
			date: "October 31",
			title: "Halloween",
			description:
				"Share spooky content, costumes, and Halloween-themed memes, using hashtags like #Halloween and #SpookySeason.",
		},
		{
			date: "December 25",
			title: "Christmas",
			description:
				"Share festive content, holiday traditions, and Christmas-themed memes, using hashtags like #Christmas and #MerryChristmas.",
		},
	];

	const calendarEventsGrouped = calendarEvents.reduce(
		(acc, event) => {
			const month = event.date.split(" ")[0];
			if (!acc[month]) acc[month] = [];
			acc[month].push(event);
			return acc;
		},
		{} as Record<string, typeof calendarEvents>,
	);

	const monthOrder = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	return (
		<View className="flex-1 w-full items-center justify-center bg-white dark:bg-oxford-500">
			<ScrollView className="flex-1 px-5 pt-5 bg-white dark:bg-oxford-500 web:mx-auto web:max-w-2xl">
				<Text className="text-4xl font-extrabold text-center mb-8 text-black dark:text-white">
					Social Media Trends
				</Text>

				{trends.map((trend, index) => (
					<View
						key={index}
						className={`rounded-2xl p-5 mb-6 shadow-md ${platformColors[trend.platform] || "bg-gray-200"}`}
						style={{ elevation: 6 }}
					>
						<View className="bg-black/50 dark:bg-black/50 p-2 rounded-2xl flex-row items-center mb-2">
							<Text className="text-sm font-bold text-white bg-black px-3 py-1 rounded-full mr-3">
								{trend.platform}
							</Text>
							<Text className="text-xl font-bold text-white">
								{trend.title}
							</Text>
						</View>
						<Text className="text-white text-base">{trend.description}</Text>
					</View>
				))}

				{/* 🔥 Hashtag Trends Section */}
				<Text className="text-3xl font-extrabold text-black dark:text-white mt-10 mb-4">
					# Trending Hashtags
				</Text>

				<View className="flex flex-wrap flex-row mb-10">
					{hashtagTrends.map((hashtag, index) => (
						<View
							key={index}
							className="bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2 mr-2 mb-2"
						>
							<Text className="text-black dark:text-white font-semibold">
								{hashtag}
							</Text>
						</View>
					))}
				</View>

				{/* 📅 Calendar Events Section */}
				<Text className="text-3xl font-extrabold text-black dark:text-white mb-4">
					📅 Monthly Viral Events
				</Text>

				<View className="h-[500px] mb-10">
					<ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
					>
						{monthOrder.map((month) => {
							const events = calendarEventsGrouped[month];
							if (!events) return null;

							return (
								<View key={month} style={{ width: 300 }} className="px-3">
									<Text className="text-2xl font-bold text-black dark:text-white mb-4">
										{month}
									</Text>

									<ScrollView showsVerticalScrollIndicator={false}>
										{events.map((event, index) => (
											<View
												key={index}
												className="mb-4 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-sm"
											>
												<Text className="text-sm text-black dark:text-white mb-1 font-medium">
													{event.date}
												</Text>
												<Text className="text-lg text-black dark:text-white font-bold">
													{event.title}
												</Text>
												<Text className="text-black dark:text-white">
													{event.description}
												</Text>
											</View>
										))}
									</ScrollView>
								</View>
							);
						})}
					</ScrollView>
				</View>
			</ScrollView>
		</View>
	);
}
