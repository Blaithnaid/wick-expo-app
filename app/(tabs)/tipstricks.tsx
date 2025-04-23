import { View, Text, ScrollView, Image, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tips = [
  {
    platform: 'TikTok',
    tip: 'Post consistently and use trending sounds!',
    videoUrl: 'https://www.youtube.com/watch?v=tiktok_tips_123',
    thumbnail: 'https://img.youtube.com/vi/tiktok_tips_123/0.jpg',
  },
  {
    platform: 'Instagram',
    tip: 'Use Reels and optimize hashtags.',
    videoUrl: 'https://www.youtube.com/watch?v=insta_tips_456',
    thumbnail: 'https://img.youtube.com/vi/insta_tips_456/0.jpg',
  },
  {
    platform: 'YouTube',
    tip: 'Engage in the first 15 seconds and use good thumbnails!',
    videoUrl: 'https://www.youtube.com/watch?v=youtube_tips_789',
    thumbnail: 'https://img.youtube.com/vi/youtube_tips_789/0.jpg',
  },
];

export default function TipsAndTricks() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4 text-center">📈 Social Media Tips & Tricks</Text>

        {tips.map((item, index) => (
          <View key={index} className="mb-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4">
            <Text className="text-lg font-semibold mb-2">{item.platform}</Text>
            <Text className="mb-3 text-gray-700 dark:text-gray-300">{item.tip}</Text>
            <Pressable onPress={() => Linking.openURL(item.videoUrl)}>
              <Image
                source={{ uri: item.thumbnail }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
              <Text className="mt-2 text-blue-600 text-center">🎥 Watch on YouTube</Text>
            </Pressable>
          </View>
        ))}

        <Text className="text-xl font-bold mt-10 mb-4">📝 Recommended Blogs</Text>
        <Pressable onPress={() => Linking.openURL('https://www.sprinklr.com/blog/how-to-drive-organic-growth-on-social-media/')}>
          <Text className="text-blue-600 underline mb-2">Blog1</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://www.forbes.com/sites/nicolesmith/2024/08/19/the-art-of-engagement-key-to-rapidly-growing-social-media-following/')}>
          <Text className="text-blue-600 underline mb-2">Blog2</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://buffer.com/resources/')}>
          <Text className="text-blue-600 underline">Blog3</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
