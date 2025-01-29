import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { ScrollView, View } from "@/components/Themed";
import Markdown from "react-native-markdown-display";

export default function ModalScreen() {
	const modalText = `
# WickBot
Your Social Media Assistant

Get help managing your social media presence with WickBot, your AI-powered assistant.

## Key Features

### Content Creation
- Generate engaging captions and post ideas
- Suggest relevant hashtags and trending topics
- Create content calendars and posting schedules
- Brainstorm campaign themes and content series

### Engagement Support
- Draft responses to follower comments
- Create polls and interactive content
- Suggest ways to boost post engagement
- Help manage community interactions

### Strategy & Optimization
- Recommend optimal posting times
- Suggest content improvements
- Help format posts for different platforms
- Provide growth strategy suggestions

## Example Prompts

"Help me write a caption for this photo"
"What hashtags should I use for my fitness post?"
"Give me content ideas for next week"
"How can I improve my engagement?"
"Draft a response to this customer comment"

## Tips for Best Results

1. Be specific about what you need
2. Provide context about your brand and audience
3. Feel free to ask for refinements
4. Save helpful responses for future reference

## Remember
WickBot is your creative assistant, not a replacement for human judgment. Use its suggestions as inspiration and adapt them to match your unique brand voice.

*Note: WickBot cannot post directly to social media or access real-time analytics.*
	`;

	return (
		<ScrollView>
			<View className="flex-1 items-left text-left justify-center px-5 text-white">
				<Markdown style={{ body: { color: "white" } }}>
					{modalText}
				</Markdown>
			</View>
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</ScrollView>
	);
}
