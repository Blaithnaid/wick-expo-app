import { ScrollView, Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthContext } from "@/services/AuthProvider";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
    const colorScheme = useColorScheme().colorScheme;
    const auth = useAuthContext();
    const profileImage = auth.profile?.photoURL || "https://via.placeholder.com/50";

    const monthlyProgress = [
        { name: "Done", value: 22, color: "bg-green-400" },
        { name: "In Progress", value: 7, color: "bg-orange-400" },
        { name: "Ongoing", value: 12, color: "bg-red-400" },
        { name: "Waiting For Review", value: 14, color: "bg-blue-400" }
    ];

    const recommendedCards = [
        { name: "New Feature 1", color: "bg-purple-500" },
        { name: "New Feature 2", color: "bg-indigo-500" },
        { name: "New Feature 3", color: "bg-gray-500" },
        { name: "New Feature 4", color: "bg-cyan-500" }
    ];

    return (
        <ScrollView className="flex-1 w-full px-5 py-4 flex items-center">
            {/* Header Section */}
            <View className="flex-row items-center justify-between w-full max-w-md">
                <View className="flex-row items-center">
                    <Image source={{ uri: profileImage }} className="w-12 h-12 rounded-full" />
                    <View className="ml-3">
                        <Text className="text-gray-500 text-lg">Hello,</Text>
                        <Text className="text-xl font-semibold text-indigo-600">
                            {auth.profile?.displayName || "Username"}
                        </Text>
                    </View>
                </View>
                <FontAwesome size={24} name="bell" color={colorScheme === "dark" ? "white" : "black"} />
            </View>

            {/* Monthly Progress Section */}
            <View className="grid grid-cols-2 gap-4 mt-6 max-w-md">
                {monthlyProgress.map((item, index) => (
                    <View key={index} className={`${item.color} p-5 rounded-xl items-center shadow-lg shadow-${item.color} transform scale-105`} style={{ elevation: 10 }}>
                        <Text className="text-white text-2xl font-bold">{item.value}</Text>
                        <Text className="text-white">{item.name}</Text>
                    </View>
                ))}
            </View>

            {/* Recommended Section */}
            <Text className="mt-6 text-lg font-semibold">Recommended for you</Text>
            <View className="grid grid-cols-2 gap-4 mt-3 max-w-md">
                {recommendedCards.map((card, index) => (
                    <View key={index} className={`${card.color} p-5 rounded-xl items-center shadow-lg shadow-${card.color} transform scale-105`} style={{ elevation: 10 }}>
                        <Text className="text-white text-lg font-bold">{card.name}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
