import { ScrollView, View } from "@/components/Themed";
import { useColorScheme } from "@/hooks/useColorScheme";
import Markdown from "react-native-markdown-display";

export default function ProfileModalScreen() {
	const modalText = `
Whether you're switching platforms, analyzing your social media footprint, or simply want a copy of your Instagram history, downloading your data can be useful. Instagram allows users to export detailed information about their account — including media, personal details, and follower data — directly from the app. Here’s how you can do it:

### 📱 Step-by-Step instructions:

1. **Open Instagram** and go to your **profile page**.
2. Tap the **menu icon** (three horizontal lines) in the top-right corner.
3. Select **“Accounts Centre”** from the menu.
4. Navigate to **“Your information and permissions.”**
5. Tap **“Download your information.”**
6. Then select **“Download or transfer information.”**
7. Choose the **Instagram profile** you wish to download data from. _(Note: Only Instagram accounts are currently supported here, not Facebook or Threads.)_
8. Tap **“Some of your information.”**
9. Choose the following categories:
    - Under **Your Instagram Activity**:
        - ✅ _Media_
    - Under **Personal Information**:
        - ✅ _Personal information_
    - Under **Connections**:
        - ✅ _Followers and following_

### 🛠 Export Settings

- **Date range:** Select **"All time"** for a full export _(or customize as needed)_
- **Format:** Choose **JSON** _(this is important, other formats will not work in Wick!)_
- **Media quality:** Select **High** for the best-quality media files

Once submitted, Instagram will begin preparing your export. You’ll receive a notification or email when it’s ready to download — this typically takes a few minutes to several hours, depending on the amount of data.
	`;

	const colorScheme = useColorScheme().colorScheme;

	return (
		<ScrollView>
			<View className="flex-1 items-left text-left justify-center px-5 pb-12 pt-px text-black dark:text-white">
				<Markdown
					style={{
						body: {
							color: colorScheme === "dark" ? "white" : "black",
						},
						heading3: {
							// marginTop:
						},
						heading4: {
							marginBottom: 5,
						},
						bullet_list: {
							marginBottom: 10,
						},
						ordered_list: {
							marginBottom: 10,
						},
					}}
				>
					{modalText}
				</Markdown>
			</View>
		</ScrollView>
	);
}
