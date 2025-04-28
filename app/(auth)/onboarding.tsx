import { useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";

const { width, height } = Dimensions.get("window");

const onboardingPages = [
  {
    title: "Plan Ahead with Ease",
    description: "Effortlessly schedule your posts to maintain a consistent online presence.",
  },
  {
    title: "Analyse Performance",
    description: "Get the best analytics and insights on your social media performance.",
  },
  {
    title: "Expert Tips at Your Fingertips",
    description: "Discover the best strategies to boost your social media game.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(tabs)'); // or wherever your home screen is
  };

  const resetOnboarding = async () => {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    alert('Onboarding reset! Restart the app.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colorScheme === "dark" ? "#000" : "#fff" }}>
      <Swiper
        loop={false}
        showsPagination={true}
        onIndexChanged={(index) => setCurrentIndex(index)}
        dotStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 3,
        }}
        activeDotStyle={{
          backgroundColor: "#6F6DB2",
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 3,
        }}
      >
        {onboardingPages.map((page, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            {/* Image placeholder */}
            <View style={{ width: width * 0.8, height: height * 0.4, marginBottom: 40 }}>
              <Image
                // source={require('your-image-here')}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </View>

            <Text style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: colorScheme === "dark" ? "#FFF" : "#000",
              marginBottom: 20,
            }}>
              {page.title}
            </Text>

            <Text style={{
              fontSize: 16,
              textAlign: "center",
              color: colorScheme === "dark" ? "#DDD" : "#666",
            }}>
              {page.description}
            </Text>

            {/* Only show Get Started on the last page */}
            {index === onboardingPages.length - 1 && (
              <TouchableOpacity
                onPress={handleGetStarted}
                style={{
                  marginTop: 40,
                  backgroundColor: "#6F6DB2",
                  paddingHorizontal: 50,
                  paddingVertical: 15,
                  borderRadius: 30,
                }}
              >
                <Text style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}>
                  Get Started
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Swiper>

      {/* Always show Reset button at the bottom */}
      <TouchableOpacity
        onPress={resetOnboarding}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          RESET ONBOARDING
        </Text>
      </TouchableOpacity>
    </View>
  );
}
