import { ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Trends() {
	const { colorScheme } = useColorScheme();

	const trends = [
		{ platform: "TikTok", title: "Interactive live streams", description: "Creators will use artificial intelligence to produce original videos, music, and effects, allowing audiences to interact in real time through polls, filters, and dynamic content tailored to viewer feedback." },
		{ platform: "Instagram", title: "Photo Dumps", description: "Casual, messy photo carousels showing 'real' life moments often unedited, random, and authentic glimpses into someone’s week, trip, or mood, making social media feel more personal again." },
		{ platform: "YouTube", title: "Day in My Life Vlogs", description: "Personal, chill vlogs that feel authentic and cozy featuring everyday routines, candid thoughts, aesthetic visuals, and subtle storytelling that makes viewers feel like they’re hanging out with a friend."},
		{ platform: "Facebook", title: "Live Streams", description:  "Streamers acting like characters and playing games to keep people engaged, often incorporating storytelling, giveaways, or challenges to boost viewer interaction and community participation." },
		{ platform: "X", title: "Posting Video Clips", description: "Users are posting short, snappy video clips,from hot takes to highlights and memes to gather interest and drive traffic to their profiles or larger platforms like YouTube or Patreon." },
		{ platform: "Twitch", title: "Streaming", description: "Big, high energy streams and IRL (in real life) content are trending streamers are engaging with audiences through live chats, spontaneous adventures, and creative content that blurs the line between entertainment and personal connection." },
	];

	const platformColors = {
		TikTok: "bg-blue-500",
		Instagram: "bg-purple-500",
		YouTube: "bg-red-500",
        Facebook: "bg-green-500",
        X: "bg-yellow-500",
        Twitch: "bg-blue-500"
	};

	return (
		<ScrollView className="flex-1 px-5 pt-5 bg-white dark:bg-oxford-500">
			<Text className="text-4xl font-extrabold text-center mb-8 text-black dark:text-white">
				Social Media Trends
			</Text>

			{trends.map((trend, index) => (
				<View
					key={index}
					className={`rounded-2xl p-5 mb-6 shadow-md ${platformColors[trend.platform] || 'bg-gray-200'}`}
					style={{ elevation: 6 }}
				>
					<View className="flex-row items-center mb-2">
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
		</ScrollView>
	);
}
