// npm install react-native-swiper @react-navigation/native
// npm install @react-navigation/native @react-navigation/native-stack expo-router

import { useState } from "react";
import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { AuthStackParamList } from '@types/navigation';
import Swiper from "react-native-swiper";

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

  //const (width, height) = Dimensions.get("window");
