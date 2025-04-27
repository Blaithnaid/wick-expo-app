import { ScrollView, Image, Pressable, Linking, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme'; // Import the color scheme hook
import { Text, View } from "@/components/Themed";

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const groupedTips = [
  {
    platform: 'Instagram',
    videos: [
      {
        tip: 'Use Reels & optimize hashtags.',
        videoUrl: 'https://youtu.be/rGJGmTIS5L0?si=pGrEQN5i4JD6djb1',
        thumbnail: 'https://img.youtube.com/vi/rGJGmTIS5L0/0.jpg',
      },
      {
        tip: 'Making Aesthetic Posts.',
        videoUrl: 'https://youtu.be/EDS9sJFFBS8?si=RnjR0lbr2SqmpGrS',
        thumbnail: 'https://img.youtube.com/vi/EDS9sJFFBS8/0.jpg',
      },
      {
        tip: 'How to Gain Followers.',
        videoUrl: 'https://youtu.be/7Eiqe_sShQg?si=mNDqMzT6Rz5d1c-v',
        thumbnail: 'https://img.youtube.com/vi/7Eiqe_sShQg/0.jpg',
      },
      {
        tip: 'Learning the Instagram Algorithm.',
        videoUrl: 'https://youtu.be/aZH3c9NNqGs?si=3eyyFPyDRa6T9cyt',
        thumbnail: 'https://img.youtube.com/vi/aZH3c9NNqGs/0.jpg',
      },
    ],
  },
  {
    platform: 'TikTok',
    videos: [
      {
        tip: 'Grow your TikTok account.',
        videoUrl: 'https://youtu.be/ZyJsH9X0MXY?si=PZo47XODleIqf2iU',
        thumbnail: 'https://img.youtube.com/vi/ZyJsH9X0MXY/0.jpg',
      },
      {
        tip: '19 TIps Before Starting TikTok.',
        videoUrl: 'https://youtu.be/ICU-j1pItlA?si=NOY-OgKfMMi9Spqm',
        thumbnail: 'https://img.youtube.com/vi/ICU-j1pItlA/0.jpg',
      },
      {
        tip: 'Gaining Followers on TikTok.',
        videoUrl: 'https://youtu.be/xbWFG_ECUhc?si=tD9uM2Bp6xIuYAnF',
        thumbnail: 'https://img.youtube.com/vi/xbWFG_ECUhc/0.jpg',
      },
      {
        tip: 'How to Monitise your TikTok account.',
        videoUrl: 'https://youtu.be/YyLsCYBjUzI?si=zD_N8eF5GGHiEpfJ',
        thumbnail: 'https://img.youtube.com/vi/YyLsCYBjUzI/0.jpg',
      },
    ],
  },
  {
    platform: 'YouTube',
    videos: [
      {
        tip: '10 Youtube Short Hacks!',
        videoUrl: 'https://youtu.be/agC7mcC7WoQ?si=1epj-7yXJQR9tXp7',
        thumbnail: 'https://img.youtube.com/vi/agC7mcC7WoQ/0.jpg',
      },
      {
        tip: 'Youtube Gear Checklist.',
        videoUrl: 'https://youtu.be/zH3eaMHVZs4?si=zfcy8C0VLq4LRUmd',
        thumbnail: 'https://img.youtube.com/vi/zH3eaMHVZs4/0.jpg',
      },
      {
        tip: 'End screens/cards to promote other videos.',
        videoUrl: 'https://youtu.be/2Te4-B1wHAI?si=v63-TUIg34T2CoHw',
        thumbnail: 'https://img.youtube.com/vi/2Te4-B1wHAI/0.jpg',
      },
      {
        tip: 'Optimize video titles & descriptions for SEO.',
        videoUrl: 'https://youtu.be/-uE4WxFX5XY?si=F4gOcUQz-EGa1E2r',
        thumbnail: 'https://img.youtube.com/vi/-uE4WxFX5XY/0.jpg',
      },
    ],
  },
];

const bestTimesToPost = [
  {
    platform: 'TikTok',
    times: {
      Monday: '10 AM - 12 PM',
      Tuesday: '2 PM - 4 PM',
      Wednesday: '1 PM - 3 PM',
      Thursday: '4 PM - 6 PM',
      Friday: '6 PM - 8 PM',
      Saturday: '9 AM - 11 AM',
      Sunday: '3 PM - 5 PM',
    },
  },
  {
    platform: 'YouTube',
    times: {
      Monday: '12 PM - 2 PM',
      Tuesday: '3 PM - 5 PM',
      Wednesday: '5 PM - 7 PM',
      Thursday: '6 PM - 8 PM',
      Friday: '7 PM - 9 PM',
      Saturday: '10 AM - 12 PM',
      Sunday: '4 PM - 6 PM',
    },
  },
  {
    platform: 'Instagram',
    times: {
      Monday: '9 AM - 11 AM',
      Tuesday: '11 AM - 1 PM',
      Wednesday: '2 PM - 4 PM',
      Thursday: '3 PM - 5 PM',
      Friday: '5 PM - 7 PM',
      Saturday: '8 AM - 10 AM',
      Sunday: '6 PM - 8 PM',
    },
  },
];

export default function TipsAndTricks() {
  const animations = useRef(groupedTips.map(() => ({
    translateY: new Animated.Value(50),
    opacity: new Animated.Value(0),
  }))).current;

  const blogAnimations = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;

  const colorScheme = useColorScheme(); // Detect system theme (light or dark)

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

  const backgroundColor = colorScheme.colorScheme === 'dark' ? '#1e1e1e' : '#ffffff'; // Match dark mode grayish color
  const textColor = colorScheme.colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {/* Header */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
            color: textColor,
          }}
        >
          🚀 Social Media Tips & Tricks
        </Text>

        {/* Best Times to Post Carousel */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
            color: textColor,
          }}
        >
        

        {/* Grouped Tips */}
        {groupedTips.map((group, index) => (
          <View
            key={index}
            style={{
              marginBottom: 24,
              width: '100%',
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 12,
                color: textColor,
              }}
            >
              {group.platform}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'flex-start', // Ensure proper alignment
                paddingHorizontal: 16,
              }}
            >
              {group.videos.map((video, idx) => (
                <Animated.View
                  key={idx}
                  style={{
                    transform: [{ translateY: animations[index].translateY }],
                    opacity: animations[index].opacity,
                    marginRight: idx === group.videos.length - 1 ? 0 : 16, // Remove margin for the last video
                    alignItems: 'center',
                    backgroundColor: colorScheme.colorScheme === 'dark' ? '#2c2c2c' : '#f0f0f0',
                    borderRadius: 8,
                    overflow: 'hidden',
                    width: 200,
                  }}
                >
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={{
                      width: 192,
                      height: 112,
                      resizeMode: 'cover',
                    }}
                  />
                  <View
                    style={{
                      padding: 12,
                      flex: 1,
                      justifyContent: 'space-between', // Distribute space between title and button
                    }}
                  >
                    {/* Title Container with Fixed Height */}
                    <View
                      style={{
                        minHeight: 40, // Ensure consistent height for all titles
                        justifyContent: 'center', // Center the text vertically
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          marginBottom: 8,
                          color: textColor,
                        }}
                      >
                        {video.tip}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => Linking.openURL(video.videoUrl)}
                      style={{
                        backgroundColor: '#007bff',
                        borderRadius: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          textAlign: 'center',
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
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 24,
            marginBottom: 16,
            color: textColor,
          }}
        >
          📝 Recommended Blogs
        </Text>

        <View style={{ width: '100%', alignItems: 'center', marginBottom: 24 }}>
          {/* Blog 1 */}
          <Animated.View style={{ transform: [{ scale: blogAnimations[0] }] }}>
            <Pressable
              onPress={() =>
                Linking.openURL('https://www.sprinklr.com/blog/how-to-drive-organic-growth-on-social-media/')
              }
              onPressIn={() => handlePressIn(0)}
              onPressOut={() => handlePressOut(0)}
              style={{
                backgroundColor: '#007bff',
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                width: width * 0.9,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                📈 How to Drive Organic Growth on Social Media
              </Text>
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
              style={{
                backgroundColor: '#28a745',
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                width: width * 0.9,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                🔥 The Art of Engagement for Social Media Growth
              </Text>
            </Pressable>
          </Animated.View>

          {/* Blog 3 */}
          <Animated.View style={{ transform: [{ scale: blogAnimations[2] }] }}>
            <Pressable
              onPress={() => Linking.openURL('https://buffer.com/resources/')}
              onPressIn={() => handlePressIn(2)}
              onPressOut={() => handlePressOut(2)}
              style={{
                backgroundColor: '#6f42c1',
                borderRadius: 8,
                padding: 16,
                width: width * 0.9,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                📊 Buffer Resources for Social Media Growth
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        📅 Best Times to Post
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            paddingHorizontal: 16,
          }}
        >
          {bestTimesToPost.map((platform, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colorScheme.colorScheme === 'dark' ? '#2c2c2c' : '#f0f0f0',
                borderRadius: 12,
                padding: 16,
                marginRight: 16,
                width: width * 0.8, // Responsive width
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 12,
                  color: textColor,
                }}
              >
                {platform.platform}
              </Text>
              {Object.entries(platform.times).map(([day, time], idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: textColor,
                    }}
                  >
                    {day}:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                    }}
                  >
                    {time}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}