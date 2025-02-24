import { View, Text } from "@/components/Themed";
import { router } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthContext } from "@/services/AuthProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import { Divider } from "@/components/ui/divider";
import Importer from "@/components/Importer"

export default function IgProfileScreen() {
  const auth = useAuthContext();
  const colorScheme = useColorScheme().colorScheme;

  if (!auth || !auth.profile) {
    return (
      <View className="flex-1 items-center justify-center px-5 flex">
        <FontAwesome
          name="user-plus"
          size={80}
          color={
            colorScheme === "dark" ? "white" : "black"
          }
        />
        <View className="mt-4 mb-3 h-[2px] rounded-full w-[55%] bg-slate-400" />
        <Text className="text-xl text-center w-2/3">
          You are not signed in!
        </Text>
        <Text className="text-lg text-center w-3/4 mt-4">
          Head over to <View className="text-bold">Settings</View> and create an account, or sign back in!
        </Text>
        <Text className="text-lg text-center w-3/4 mt-2">
          Once signed in, you can easily sync your profile to our <View className="text-bold">Web client!</View>
        </Text>
      </View>
    )
  }

  if (!auth.profile.igProfile) {
    return (
      <View className="h-full w-full">
        <Importer />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center pt-3 h-full w-full">
      <View>
        <View>
          <Image />
        </View>
      </View>
    </View>
  );
}
