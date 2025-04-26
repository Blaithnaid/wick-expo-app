import { View, Text, ScrollView, Image, Pressable, Linking, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const tips = [
  {
    platform: 'Instagram',
    tip: 'Use Reels and optimize hashtags.',
    videoUrl: 'https://www.youtube.com/watch?v=insta_tips_456',
    thumbnail: 'https://img.youtube.com/vi/insta_tips_456/0.jpg',
    color: 'instagram',
  },
  {
    platform: 'TikTok',
    tip: 'Post consistently and use trending sounds!',
    videoUrl: 'https://www.youtube.com/watch?v=tiktok_tips_123',
    thumbnail: 'https://img.youtube.com/vi/tiktok_tips_123/0.jpg',
    color: 'bg-black',
  },
  {
    platform: 'YouTube',
    tip: 'Engage in the first 15 seconds and use good thumbnails!',
    videoUrl: 'https://www.youtube.com/watch?v=youtube_tips_789',
    thumbnail: 'https://img.youtube.com/vi/youtube_tips_789/0.jpg',
    color: 'bg-red-600',
  },
];

export default function TipsAndTricks() {
  const animations = useRef(tips.map(() => ({
    translateY: new Animated.Value(50),
    opacity: new Animated.Value(0),
  }))).current;

  const blogAnimations = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;

  useEffect(() => {
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
  }, []);

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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-oxford-500">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <Text className="text-3xl font-extrabold text-white text-center mb-8 py-2 px-6 rounded-lg border-4 border-green-600 shadow-lg bg-gradient-to-r from-green-500 to-teal-600">
          🚀 Social Media Tips & Tricks
        </Text>

        {tips.map((item, index) => {
          const animationStyle = {
            transform: [{ translateY: animations[index].translateY }],
            opacity: animations[index].opacity,
          };

          // For Instagram specific styling
          if (item.color === 'instagram') {
            return (
              <Animated.View key={index} style={[animationStyle]}>
                <LinearGradient
                  colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-green-600"
                >
                  <Image
                    source={{ uri: item.thumbnail }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <Text className="text-xl font-bold text-white">{item.platform}</Text>
                    <Text className="text-white/80 my-2">{item.tip}</Text>
                    <Pressable
                      onPress={() => Linking.openURL(item.videoUrl)}
                      className="bg-white mt-4 rounded-full py-2 px-4"
                    >
                      <Text className="text-center text-black font-semibold">🎥 Watch Video</Text>
                    </Pressable>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          }

          // For other platforms
          return (
            <Animated.View key={index} style={[animationStyle]}>
              <View className={`mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-green-600 ${item.color}`}>
                <Image
                  source={{ uri: item.thumbnail }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <View className="p-4">
                  <Text className="text-xl font-bold text-white">{item.platform}</Text>
                  <Text className="text-white/80 my-2">{item.tip}</Text>
                  <Pressable
                    onPress={() => Linking.openURL(item.videoUrl)}
                    className="bg-white mt-4 rounded-full py-2 px-4"
                  >
                    <Text className="text-center text-black font-semibold">🎥 Watch Video</Text>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          );
        })}

        {/* Recommended Blogs */}
        <Text className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 text-center">
          📝 Recommended Blogs
        </Text>

        <View className="space-y-6 mb-10">
          {/* Blog 1 */}
          <Animated.View style={{ transform: [{ scale: blogAnimations[0] }] }}>
            <Pressable
              onPress={() =>
                Linking.openURL('https://www.sprinklr.com/blog/how-to-drive-organic-growth-on-social-media/')
              }
              onPressIn={() => handlePressIn(0)}
              onPressOut={() => handlePressOut(0)}
              className="bg-blue-600 rounded-lg shadow-lg transform transition-all duration-300 border-4 border-green-600"
            >
              <View className="flex-row items-center p-4">
                <View className="bg-white rounded-full p-2 mr-4">
                  <Text className="text-2xl text-blue-600">📈</Text> {/* Icon for Blog */}
                </View>
                <Text className="text-white font-semibold text-lg">
                  How to Drive Organic Growth on Social Media
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Blog 2 */}
          <Animated.View style={{ transform: [{ scale: blogAnimations[1] }] }}>
            <Pressable
              onPress={() =>
                Linking.openURL('https://www.forbes.com/sites/nicolesmith/2024/08/19/the-art-of-engagement-key-to-rapidly-growing-social-media-following/')
              }
              onPressIn={() => handlePressIn(1)}
              onPressOut={() => handlePressOut(1)}
              className="bg-green-600 rounded-lg shadow-lg transform transition-all duration-300 border-4 border-green-600"
            >
              <View className="flex-row items-center p-4">
                <View className="bg-white rounded-full p-2 mr-4">
                  <Text className="text-2xl text-green-600">🔥</Text> {/* Icon for Blog */}
                </View>
                <Text className="text-white font-semibold text-lg">
                  The Art of Engagement for Social Media Growth
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Blog 3 */}
          <Animated.View style={{ transform: [{ scale: blogAnimations[2] }] }}>
            <Pressable
              onPress={() =>
                Linking.openURL('https://buffer.com/resources/')
              }
              onPressIn={() => handlePressIn(2)}
              onPressOut={() => handlePressOut(2)}
              className="bg-purple-600 rounded-lg shadow-lg transform transition-all duration-300 border-4 border-green-600"
            >
              <View className="flex-row items-center p-4">
                <View className="bg-white rounded-full p-2 mr-4">
                  <Text className="text-2xl text-purple-600">📊</Text> {/* Icon for Blog */}
                </View>
                <Text className="text-white font-semibold text-lg">
                  Buffer Resources for Social Media Growth
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
