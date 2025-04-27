import { View, Text, Image, Pressable, Linking, ScrollView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { ref, getDownloadURL } from "firebase/storage";
import { useFirebaseContext } from "../../services/FirebaseProvider";
import * as FileSystem from 'expo-file-system';

interface Filter {
  title: string;
  thumbnail: string;
  videoPath: string;
  tiktokLink: string;
}

interface FilterWithVideo extends Filter {
  videoUrl?: string | null;
  needsDownload?: boolean;
}

const filters: Filter[] = [
  {
    title: "Guess The Country",
    thumbnail: "https://picsum.photos/400/300",
    videoPath: "filters/guesscountrydemodemo.mp4", // This file exists
    tiktokLink: "https://vm.tiktok.com/ZNd29DgSQ/",
  },
  {
    title: "Popular Anime Tournament",
    thumbnail: "https://picsum.photos/400/300?random=1",
    videoPath: "filters/guesscountrydemodemo.mp4", // Using existing file for demo
    tiktokLink: "https://vm.tiktok.com/ZNd29J6yk/",
  },
  {
    title: "Colourful Hair Colours",
    thumbnail: "https://picsum.photos/400/300?random=2",
    videoPath: "filters/guesscountrydemodemo.mp4", // Using existing file for demo
    tiktokLink: "https://vm.tiktok.com/ZNd29LT32/",
  },
  {
    title: "Blind Ranking",
    thumbnail: "https://picsum.photos/400/300?random=3",
    videoPath: "filters/guesscountrydemodemo.mp4", // Using existing file for demo
    tiktokLink: "https://www.example.com",
  },
  {
    title: "Beard Removal Filter",
    thumbnail: "https://picsum.photos/400/300?random=4",
    videoPath: "filters/guesscountrydemodemo.mp4", // Using existing file for demo
    tiktokLink: "https://vm.tiktok.com/ZNd29DgSQ/",
  },
  {
    title: "Gradient Hair Filter",
    thumbnail: "https://picsum.photos/400/300?random=5",
    videoPath: "filters/guesscountrydemodemo.mp4", // Using existing file for demo
    tiktokLink: "https://vm.tiktok.com/ZNd29Fyg7/",
  },
];

export default function TikTokFiltersPage() {
  const { myStorage } = useFirebaseContext();
  const [filterVideos, setFilterVideos] = useState<FilterWithVideo[]>(filters);
  const [loading, setLoading] = useState(true);
  const [downloadingVideos, setDownloadingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeVideos = async () => {
      try {
        if (!myStorage) {
          console.error("Firebase Storage is not initialized");
          setError("Firebase Storage is not initialized");
          setLoading(false);
          return;
        }

        // Web platform: Stream directly from Firebase
        if (Platform.OS === 'web') {
          const updatedFilters = await Promise.all(
            filters.map(async (filter): Promise<FilterWithVideo> => {
              if (filter.videoPath) {
                try {
                  const videoRef = ref(myStorage, filter.videoPath);
                  const videoUrl = await getDownloadURL(videoRef);
                  console.log(`Successfully got URL for ${filter.title}: ${videoUrl}`);
                  return { ...filter, videoUrl };
                } catch (error) {
                  console.error(`Error getting video URL for ${filter.title}:`, error);
                  return { ...filter, videoUrl: null };
                }
              }
              return filter;
            })
          );
          
          setFilterVideos(updatedFilters);
          setLoading(false);
        } 
        // Mobile platforms: Use local caching
        else {
          const updatedFilters = await Promise.all(
            filters.map(async (filter): Promise<FilterWithVideo> => {
              if (filter.videoPath) {
                // Create a local filename
                const localUri = `${FileSystem.documentDirectory}${filter.videoPath.replace(/\//g, '_')}`;
                
                // Check if file exists locally
                const fileInfo = await FileSystem.getInfoAsync(localUri);
                
                if (fileInfo.exists) {
                  // Use local file
                  return { ...filter, videoUrl: localUri };
                } else {
                  // File doesn't exist locally, need to download
                  return { ...filter, videoUrl: null, needsDownload: true };
                }
              }
              return filter;
            })
          );
          
          setFilterVideos(updatedFilters);
          setLoading(false);
          
          // Download missing videos in the background
          const needsDownload = updatedFilters.some(filter => filter.needsDownload);
          if (needsDownload) {
            downloadMissingVideos(updatedFilters);
          }
        }
      } catch (error) {
        console.error("Error initializing videos:", error);
        if (error instanceof Error) {
          setError(error.message || "Error loading filters");
        } else {
          setError("Error loading filters");
        }
        setLoading(false);
      }
    };

    const downloadMissingVideos = async (currentFilters: FilterWithVideo[]) => {
      // Only for mobile platforms
      if (Platform.OS === 'web') return;
      
      setDownloadingVideos(true);
      
      try {
        const updatedFilters = await Promise.all(
          currentFilters.map(async (filter): Promise<FilterWithVideo> => {
            if (filter.needsDownload && filter.videoPath) {
              const localUri = `${FileSystem.documentDirectory}${filter.videoPath.replace(/\//g, '_')}`;
              
              try {
                // Get download URL from Firebase
                const videoRef = ref(myStorage, filter.videoPath);
                const remoteUrl = await getDownloadURL(videoRef);
                
                // Download file to local storage
                const downloadResult = await FileSystem.downloadAsync(
                  remoteUrl,
                  localUri
                );
                
                if (downloadResult.status === 200) {
                  // Successfully downloaded
                  return { ...filter, videoUrl: localUri, needsDownload: false };
                }
              } catch (error) {
                console.error(`Error downloading video for ${filter.title}:`, error);
              }
            }
            return filter;
          })
        );
        
        setFilterVideos(updatedFilters);
      } catch (error) {
        console.error("Error downloading videos:", error);
      } finally {
        setDownloadingVideos(false);
      }
    };

    initializeVideos();
  }, [myStorage]);

  // Put filters into pairs
  const rows: FilterWithVideo[][] = [];
  for (let i = 0; i < filterVideos.length; i += 2) {
    rows.push(filterVideos.slice(i, i + 2));
  }

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-oxford-500 justify-center items-center">
        <Text className="text-lg text-gray-900 dark:text-white">Loading filters...</Text>
        {error && (
          <Text className="text-red-500 mt-2 text-center px-4">{error}</Text>
        )}
      </View>
    );
  }

  return (
    <ScrollView className="bg-white dark:bg-oxford-500 p-4 flex-1">
      {/* Header Section */}
      <Text className="text-3xl font-bold mb-6 text-center animate-pulse text-gray-900 dark:text-white">
        🎬 Try Our TikTok Filters!
      </Text>
      <Text className="text-lg text-center mb-4 text-gray-800 dark:text-gray-200">
        Click on the filters below to try them out on TikTok!
      </Text>
      <Text className="text-sm text-center mb-6 text-gray-700 dark:text-gray-300">
        Note: Make sure you have the TikTok app installed to use these filters.
      </Text>
      
      {downloadingVideos && (
        <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mb-4">
          <Text className="text-blue-800 dark:text-blue-200 text-center">
            Downloading videos in the background...
          </Text>
        </View>
      )}

      {/* Render filters in pairs */}
      {rows.map((pair, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between mb-6">
          {pair.map((filter, colIndex) => (
            <View
              key={colIndex}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 w-[48%]"
            >
              {/* Filter Video Preview */}
              {filter.videoUrl ? (
  <View style={{ width: '100%', height: 144, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
    <Video
      source={{ uri: filter.videoUrl }}
      style={{ width: '100%', height: '100%' }}
      resizeMode={ResizeMode.COVER}
      shouldPlay
      isLooping
      isMuted={true}
      posterSource={{ uri: filter.thumbnail }}
      usePoster
      onError={(error) => console.error("Video error:", error)}
      onLoad={() => console.log("Video loaded successfully")}
      volume={0}
      rate={1.0}
    />
  </View>
) : (
  // Fallback to image if video is not available
  <Image
    source={{ uri: filter.thumbnail }}
    style={{ width: '100%', height: 144, borderRadius: 12, marginBottom: 12 }}
    resizeMode="cover"
  />
)}
              
              {/* Filter Title and Button */}
              <Text className="text-lg font-semibold mb-2 text-center text-gray-900 dark:text-white">
                {filter.title}
              </Text>
              <Pressable
                onPress={() => Linking.openURL(filter.tiktokLink)}
                className="bg-pink-600 dark:bg-pink-500 rounded-lg p-2 flex-row justify-center items-center"
              >
                <Text className="text-white text-center font-bold text-sm">
                  🎯 Try on TikTok
                </Text>
              </Pressable>
            </View>
          ))}
          {/* If last row has only 1 item, fill space to align nicely */}
          {pair.length === 1 && <View className="w-[48%]" />}
        </View>
      ))}
    </ScrollView>
  );
}