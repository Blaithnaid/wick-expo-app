// npm install react-native-swiper @react-navigation/native
// npm install @react-navigation/native @react-navigation/native-stack expo-router

import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Swiper from "react-native-swiper";
import type { RootStackParamList, AuthStackParamList } from "@/types/navigation";

type OnboardingScreenProps = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen = ({ navigation}: OnboardingScreenProps) => {
    const [isLastPage, setIsLastPage] = useState(false);
  const colorScheme = useColorScheme().colorScheme;

  const onboardingPages = [
    {
      title: "Plan Ahead with Ease",
      description: "Effortlessly schedule your posts to maintain a consistent online presence",
      image: require('@/assets/images/onboarding1.png'),
    },
    {
      title: "Analyse Performance",
      description: "Connect with friends and family effortlessly.",
      image: require('@/assets/images/onboarding2.png'),
    },
    {
      title: "Expert Tips at Your Fingertips",
      description: "Let's get you started on your journey!",
      image: require('@/assets/images/onboarding3.png'),
      lightbg:
        "bg-white dark:bg-gray-900",
      darkbg:
        "bg-gray-900 dark:bg-white",
    },
  ];

  // the getting started 
  const handleGetStarted = () => {
    navigation.replace("Login");
  };

  const { width, height } = Dimensions.get("window");

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
            backgroundColor: colorScheme === 'dark' ? page.darkbg : page.lightbg,
            paddingHorizontal: 20 
          }}
        >
          {/* Illustration */}
          <View style={{ 
            width: width * 0.8, 
            height: height * 0.4, 
            marginBottom: 40 
          }}>
            <Image 
              source={page.image} 
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          {/* Content */}
          <View style={{ 
            alignItems: 'center', 
            marginBottom: 40 
          }}>
            <Text 
              style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                textAlign: 'center', 
                marginBottom: 20,
                color: colorScheme === 'dark' ? 'white' : 'white'
              }}
            >
              {page.title}
            </Text>
            <Text 
              style={{ 
                fontSize: 16, 
                textAlign: 'center', 
                paddingHorizontal: 20,
                color: colorScheme === 'dark' ? 'white' : 'white'
              }}
            >
              {page.description}
            </Text>
          </View>

          {/* Last page get started button */}
          {isLastPage && (
            <TouchableOpacity 
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 50,
                paddingVertical: 15,
                borderRadius: 30,
              }}
              onPress={handleGetStarted}
            >
              <Text 
                style={{ 
                  color: '#6F6DB2', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
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
