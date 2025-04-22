import { View, Text, Image, Pressable, Linking, ScrollView } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";

const filters = [
  {
    title: "Filter1",
    thumbnail: "https://www.example.com",
    tiktokLink: "https://www.example.com",
  },
  {
    title: "Filter2",
    thumbnail: "https://www.example.com",
    tiktokLink: "https://www.example.com",
  },
];

export default function TikTokFiltersPage() {
  return (
    <ScrollView className="bg-gray-100 p-4">
      <Text className="text-3xl font-bold mb-6 text-center">🎬 Try Our TikTok Filters!</Text>

      {filters.map((filter, index) => (
        <View key={index} className="bg-white rounded-2xl shadow-lg mb-6 p-4">
          <Image
            source={{ uri: filter.thumbnail }}
            className="w-full h-56 rounded-xl mb-4"
            resizeMode="cover"
          />
          <Text className="text-xl font-semibold mb-3 text-center">{filter.title}</Text>
          <Pressable
            onPress={() => Linking.openURL(filter.tiktokLink)}
            className="bg-pink-600 rounded-xl py-2"
          >
            <Text className="text-white text-center font-bold text-base">🎯 Try on TikTok</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}


// link as child
// pressable 

//profiles index for reference