import { useState } from 'react';
import { Text, View, ScrollView } from '@/components/Themed';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/button';
import { InstagramProfile, InstagramPost } from "@/constants/Instagram";
import * as ZipArchive from 'react-native-zip-archive';

interface ImportResult {
  success: boolean;
  profile?: InstagramProfile;
  error?: string;
  debugData?: any;
}

export class InstagramArchiveHandler {
  private tempDir: string;

  constructor() {
    // Create a unique temp directory for this import
    this.tempDir = `${FileSystem.cacheDirectory}instagram_import_${Date.now()}`;
  }

  async importArchive(): Promise<ImportResult> {
    try {
      // Let user pick the Instagram archive
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ['application/zip']
      });

      if (result.canceled) {
        return { success: false, error: 'File selection canceled' };
      }

      const file = result.assets[0];

      // Create temp directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(this.tempDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.tempDir, { intermediates: true });
      }

      console.log(`Extracting ${file.name} to ${this.tempDir}`);
      // Extract the archive
      await ZipArchive.unzip(file.uri, this.tempDir);

      // Find and parse relevant JSON files
      const profile = await this.parseProfileData();

      // Store the profile data
      if (profile) {
        await this.storeProfile(profile);
      }

      return { success: true, profile };
    } catch (error) {
      console.error('Import failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during import'
      };
    } finally {
      // Clean up temp files
      await this.cleanup();
    }
  }

  async debugImport(): Promise<ImportResult> {
    try {
      // Let user pick a test archive
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ['application/zip']
      });

      if (result.canceled) {
        return { success: false, error: 'File selection canceled' };
      }

      const file = result.assets[0];
      console.log(`Selected file: ${file.name}`);

      // Create temp directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(this.tempDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.tempDir, { intermediates: true });
      }

      // Extract the archive
      console.log(`Extracting to ${this.tempDir}`);
      await ZipArchive.unzip(file.uri, this.tempDir);

      // List files in the directory to debug
      const files = await FileSystem.readDirectoryAsync(this.tempDir);
      console.log('Files in extracted directory:', files);

      // Try to read test.json from the archive
      const testJsonPath = `${this.tempDir}/test.json`;

      const testJsonExists = await FileSystem.getInfoAsync(testJsonPath);
      if (!testJsonExists.exists) {
        return { success: false, error: 'test.json not found in archive' };
      }

      const testJsonContent = await FileSystem.readAsStringAsync(testJsonPath);
      const testData = JSON.parse(testJsonContent);

      console.log('Debug test.json data:', testData);

      return {
        success: true,
        debugData: testData
      };
    } catch (error) {
      console.error('Debug import failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during debug import'
      };
    } finally {
      // Clean up temp files
      await this.cleanup();
    }
  }

  private async parseProfileData(): Promise<InstagramProfile | undefined> {
    try {
      // Common paths in Instagram export (actual paths may vary)
      const profilePath = `${this.tempDir}/content/profile.json`;
      const postsPath = `${this.tempDir}/content/posts_1.json`;

      // Check if files exist
      const profileExists = await FileSystem.getInfoAsync(profilePath);
      const postsExists = await FileSystem.getInfoAsync(postsPath);

      if (!profileExists.exists || !postsExists.exists) {
        throw new Error('Required Instagram data files not found in archive');
      }

      // Read and parse profile data
      const profileJson = await FileSystem.readAsStringAsync(profilePath);
      const postsJson = await FileSystem.readAsStringAsync(postsPath);

      const profileData = JSON.parse(profileJson);
      const postsData = JSON.parse(postsJson);

      // Transform into our app's format
      return {
        username: profileData.username,
        fullName: profileData.full_name,
        biography: profileData.biography,
        profilePicUrl: profileData.profile_pic_url,
        mediaCount: profileData.media_count,
        followersCount: profileData.followers_count,
        followingCount: profileData.following_count,
        posts: this.transformPosts(postsData)
      };
    } catch (error) {
      console.error('Error parsing profile data:', error);
      throw new Error('Failed to parse Instagram data');
    }
  }

  private transformPosts(postsData: any): InstagramPost[] {
    // This is a stub - adjust based on actual Instagram export format
    return postsData.map((post: any) => ({
      id: post.id,
      timestamp: post.timestamp,
      mediaType: post.media_type?.toLowerCase() || 'unknown',
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url || post.media_url,
      caption: post.caption,
      likes: post.like_count,
      comments: post.comment_count
    }));
  }

  private async storeProfile(profile: InstagramProfile): Promise<void> {
    // Store locally
    await AsyncStorage.setItem(
      `profile_${profile.username}`,
      JSON.stringify(profile)
    );
  }

  private async cleanup(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.tempDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.tempDir, { idempotent: true });
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

// Usage in a component:
export default function ImportScreen() {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    setDebugData(null);

    const importer = new InstagramArchiveHandler();
    const result = await importer.importArchive();

    if (!result.success) {
      setError(result.error || 'Import failed');
    }

    setImporting(false);

    if (result.success && result.profile) {
      console.log('Import successful:', result.profile.username);
      // Navigate to profile view or update UI
    }
  };

  const handleDebug = async () => {
    setImporting(true);
    setError(null);
    setDebugData(null);

    const importer = new InstagramArchiveHandler();
    const result = await importer.debugImport();

    if (!result.success) {
      setError(result.error || 'Debug import failed');
    } else if (result.debugData) {
      setDebugData(result.debugData);
    }

    setImporting(false);
  };

  return (
    <ScrollView className="flex-1">
      <View className="flex justify-center items-center w-full p-4 mb-8">
        <Text className="text-xl font-bold mb-4">Instagram Archive Importer</Text>

        <Button
          className="bg-iguana-500 w-fit px-6 py-2 mb-4"
          onPress={handleImport}
          disabled={importing}
        >
          <Text>
            {importing ? "Importing..." : "Import from Instagram"}
          </Text>
        </Button>

        <Button
          className="bg-blue-500 w-fit px-6 py-2"
          onPress={handleDebug}
          disabled={importing}
        >
          <Text>
            {importing ? "Testing..." : "Debug Import (test.json)"}
          </Text>
        </Button>

        {error && (
          <Text className="text-red-500 mt-4">{error}</Text>
        )}

        {debugData && (
          <View className="mt-4 p-4 bg-gray-100 rounded w-full">
            <Text className="font-bold mb-2">Debug Data:</Text>
            <Text>{JSON.stringify(debugData, null, 2)}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
