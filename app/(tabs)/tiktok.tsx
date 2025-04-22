import { View, Text, Image, Pressable, Linking, ScrollView } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";

const filters = [
  {
    title: "Guess The Country",
    thumbnail: "https://www.example.com",
    tiktokLink: "https://www.example.com",
  },
  {
    title: "Blind Ranking",
    thumbnail: "https://www.example.com",
    tiktokLink: "https://www.example.com",
  },
  {
  title: "Filter3",
    thumbnail: "https://www.example.com",
    tiktokLink: "https://www.example.com",
  },
  {
    title: "Filter4",
    thumbnail: "https://www.example.com",
    tiktokLink: "https://www.example.com",
  },
];

export default function TikTokFiltersPage() {
  // putting filters into pairs
  const rows = [];
  for (let i = 0; i < filters.length; i += 2) {
    rows.push(filters.slice(i, i + 2));
  }

 
  return (
    <ScrollView className="bg-gray-100 p-4">
      <Text className="text-3xl font-bold mb-6 text-center">🎬 Try Our TikTok Filters!</Text>

      <Text className="text-lg text-center mb-4">
        Click on the filters below to try them out on TikTok!
      </Text>
      <Text className="text-sm text-center mb-6">
        Note: Make sure you have the TikTok app installed to use these filters.
      </Text>

      {/* Render filters in pairs */}
      {rows.map((pair, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between mb-6">
          {pair.map((filter, colIndex) => (
            <View
              key={colIndex}
              className="bg-white rounded-2xl shadow-lg p-4 w-[48%]"
            >
              {/* Filter Thumbnail */}
              <Image
                source={{ uri: filter.thumbnail }}
                className="w-full h-36 rounded-xl mb-3"
                resizeMode="cover"
              />
              {/* Filter Title and Button */}
              <Text className="text-lg font-semibold mb-2 text-center">{filter.title}</Text>
              <Pressable
                onPress={() => Linking.openURL(filter.tiktokLink)}
                className="bg-pink-600 rounded-xl py-2"
              >
                
                <Text className="text-white text-center font-bold text-sm">🎯 Try on TikTok</Text>
              </Pressable>
            </View>
          ))}
          {/* Cool trick, if last row has only 1 item, fill space to align nicely */}
          {pair.length === 1 && <View className="w-[48%]" />}
        </View>
      ))}
    </ScrollView>
  );
}


// link as child
// pressable 

//profiles index for reference