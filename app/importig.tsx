import RNFS from 'expo-file-system';
import * as Zip from 'expo-zip';
// import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InstagramProfile, InstagramPost, ImportStatus } from "@/constants/Instagram";

interface ImportResult {
  success: boolean;
  profile?: InstagramProfile;
  error?: string;
}

export class InstagramArchiveHandler {
  private tempDir: string;
  
  constructor() {
    // Create a unique temp directory for this import
    this.tempDir = `${RNFS.TemporaryDirectoryPath}/instagram_import_${Date.now()}`;
  }

  async importArchive(): Promise<ImportResult> {
    try {
      // Let user pick the Instagram archive
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.zip],
      });

      // Create temp directory if it doesn't exist
      await RNFS.mkdir(this.tempDir);

      // Extract the archive
      await zip.unzip(file.uri, this.tempDir);

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

  private async parseProfileData(): Promise<InstagramProfile | undefined> {
    try {
      // Common paths in Instagram export
      const profilePath = `${this.tempDir}/content/profile.json`;
      const postsPath = `${this.tempDir}/content/posts_1.json`;

      // Read and parse profile data
      const profileJson = await RNFS.readFile(profilePath);
      const postsJson = await RNFS.readFile(postsPath);

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
    // Transform posts data into our format
    return postsData.map((post: any) => ({
      id: post.id,
      timestamp: post.timestamp,
      mediaType: post.media_type.toLowerCase(),
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

    // Sync to Firestore (if needed)
    // await firestore().collection('profiles').doc(profile.username).set(profile);
  }

  private async cleanup(): Promise<void> {
    try {
      await RNFS.unlink(this.tempDir);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

// Usage in a component:
const ImportScreen: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setImporting(true);
    setError(null);

    const importer = new InstagramArchiveHandler();
    const result = await importer.importArchive();

    if (!result.success) {
      setError(result.error || 'Import failed');
    }

    setImporting(false);
    
    if (result.success && result.profile) {
      // Navigate to profile view or update UI
    }
  };

  return (
    <View className="flex-1 p-4">
      <Button 
        onPress={handleImport}
        disabled={importing}
        title={importing ? "Importing..." : "Import Instagram Archive"}
      />
      {error && (
        <Text className="text-red-500 mt-2">{error}</Text>
      )}
    </View>
  );
};