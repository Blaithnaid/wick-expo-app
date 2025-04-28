import { useEffect, useState } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingScreen = () => {
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(true); // NEW: for initial loading
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem('onboardingComplete');
      if (completed) {
        router.replace('/auth/login');
      } else {
        setLoading(false); // not completed, show onboarding
      }
    };

    checkOnboarding();
  }, []);

  const onboardingPages = [
    {
      title: "Plan Ahead with Ease",
      description: "Effortlessly schedule your posts to maintain a consistent online presence.",
    },
    {
      title: "Analyse Performance",
      description: "Connect with friends and family effortlessly.",
    },
    {
      title: "Expert Tips at Your Fingertips",
      description: "Let's get you started on your journey!",
    },
  ];

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    router.replace('/auth/login');
  };

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Swiper
      loop={false}
      dotColor="rgba(255,255,255,0.3)"
      activeDotColor="white"
      onIndexChanged={(index) => setIsLastPage(index === onboardingPages.length - 1)}
    >
      {onboardingPages.map((page, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            paddingHorizontal: 20,
          }}
        >
          <View style={{ width: width * 0.8, height: height * 0.4, marginBottom: 40 }}>
            <Image style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </View>

          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 20,
              color: colorScheme === 'dark' ? 'white' : 'black',
            }}>
              {page.title}
            </Text>
            <Text style={{
              fontSize: 16,
              textAlign: 'center',
              color: colorScheme === 'dark' ? 'white' : 'gray',
            }}>
              {page.description}
            </Text>
          </View>

          {isLastPage && (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 50,
                paddingVertical: 15,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#6F6DB2',
              }}
              onPress={handleGetStarted}
            >
              <Text style={{
                color: '#6F6DB2',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                Get Started
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </Swiper>
  );
};

export default OnboardingScreen;

// await AsyncStorage.removeItem('onboardingComplete');
//resets for testing
