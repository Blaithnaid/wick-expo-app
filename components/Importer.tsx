import { ScrollView, Text, View } from "@/components/Themed";
import { Button } from "@/components/ui/button";
import { InstagramPost, InstagramProfile } from "@/constants/Instagram";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import * as ZipArchive from "react-native-zip-archive";

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
				type: ["application/zip"],
			});

			if (result.canceled) {
				return { success: false, error: "File selection canceled" };
			}

			const file = result.assets[0];

			// Create temp directory if it doesn't exist
			const dirInfo = await FileSystem.getInfoAsync(this.tempDir);
			if (!dirInfo.exists) {
				await FileSystem.makeDirectoryAsync(this.tempDir, {
					intermediates: true,
				});
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
			console.error("Import failed:", error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Unknown error during import",
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
				type: ["application/zip"],
			});

			if (result.canceled) {
				return { success: false, error: "File selection canceled" };
			}

			const file = result.assets[0];
			console.log(`Selected file: ${file.name}`);

			// Create temp directory if it doesn't exist
			const dirInfo = await FileSystem.getInfoAsync(this.tempDir);
			if (!dirInfo.exists) {
				await FileSystem.makeDirectoryAsync(this.tempDir, {
					intermediates: true,
				});
			}

			// Extract the archive
			console.log(`Extracting to ${this.tempDir}`);
			await ZipArchive.unzip(file.uri, this.tempDir);

			// recursively locate all JSON files to see what we're working with
			const jsonFiles = await this.findJsonFiles(this.tempDir);
			// log all files
			// console.log("JSON files found:", jsonFiles);

			// read in profile information
			const profilePath = `${this.tempDir}/personal_information/personal_information/personal_information.json`;
			const profileExists = await FileSystem.getInfoAsync(profilePath);

			if (profileExists.exists) {
				const profileContent = await FileSystem.readAsStringAsync(profilePath);
				const profileData = JSON.parse(profileContent);
				console.log(
					"Found profile data:",
					JSON.stringify(profileData, null, 2),
				);

				return {
					success: true,
					debugData: {
						profileData,
						foundJsonFiles: jsonFiles,
					},
				};
			} else {
				// Try to find any JSON file to debug
				if (jsonFiles.length > 0) {
					const sampleJsonPath = jsonFiles[0];
					const sampleContent =
						await FileSystem.readAsStringAsync(sampleJsonPath);
					const sampleData = JSON.parse(sampleContent);

					return {
						success: true,
						debugData: {
							samplePath: sampleJsonPath,
							sampleData,
							foundJsonFiles: jsonFiles,
						},
					};
				}

				return {
					success: false,
					error: "No JSON files found in archive",
				};
			}
		} catch (error) {
			console.error("Debug import failed:", error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Unknown error during debug import",
			};
		} finally {
			// Clean up temp files
			await this.cleanup();
		}
	}

	private async findJsonFiles(directory: string): Promise<string[]> {
		try {
			const result: string[] = [];
			const entries = await FileSystem.readDirectoryAsync(directory);

			for (const entry of entries) {
				const entryPath = `${directory}/${entry}`;
				const info = await FileSystem.getInfoAsync(entryPath);

				if (info.isDirectory) {
					const subDirFiles = await this.findJsonFiles(entryPath);
					result.push(...subDirFiles);
				} else if (entry.endsWith(".json")) {
					result.push(entryPath);
				}
			}

			return result;
		} catch (error) {
			console.error("Error finding JSON files:", error);
			return [];
		}
	}

	private async parseProfileData(): Promise<InstagramProfile | undefined> {
		try {
			// Updated paths based on the actual Instagram export structure
			const personalInfoPath = `${this.tempDir}/personal_information/personal_information/personal_information.json`;
			const postsPath = `${this.tempDir}/your_instagram_activity/media/posts_1.json`;
			const followersPath = `${this.tempDir}/connections/followers_and_following/followers_1.json`;
			const followingPath = `${this.tempDir}/connections/followers_and_following/following.json`;

			// check if files exist
			const personalInfoExists =
				await FileSystem.getInfoAsync(personalInfoPath);
			const postsExists = await FileSystem.getInfoAsync(postsPath);
			const followersExists = await FileSystem.getInfoAsync(followersPath);
			const followingExists = await FileSystem.getInfoAsync(followingPath);
			// error if any of the paths we need are missing
			if (
				!personalInfoExists.exists ||
				!postsExists.exists ||
				!followersExists.exists ||
				!followingExists.exists
			) {
				throw new Error(
					"Required Instagram profile information not found in archive",
				);
			}

			// read and parse profile data
			const personalInfoJson = await FileSystem.readAsStringAsync(
				personalInfoPath,
				{
					encoding: FileSystem.EncodingType.UTF8,
				},
			);
			const personalInfo = JSON.parse(personalInfoJson);

			// Parse followers
			const followersJson = await FileSystem.readAsStringAsync(followersPath);
			const followersData = JSON.parse(followersJson);
			const followers = this.transformFollowers(followersData);

			// Parse following
			const followingJson = await FileSystem.readAsStringAsync(followingPath);
			const followingData = JSON.parse(followingJson);
			const following = this.transformFollowing(followingData);

			// Parse posts
			let posts: InstagramPost[] = [];
			if (postsExists.exists) {
				const postsJson = await FileSystem.readAsStringAsync(postsPath);
				const postsData = JSON.parse(postsJson);
				posts = this.transformPosts(postsData);
			}

			// Transform into our app's format using the new structure
			if (personalInfo.profile_user && personalInfo.profile_user.length > 0) {
				const profileUser = personalInfo.profile_user[0];
				const stringMap = profileUser.string_map_data || {};
				const mediaMap = profileUser.media_map_data || {};

				// Extract profile picture URL if available
				let profilePicUrl = "";
				if (mediaMap["Profile Photo"]) {
					const picPath = mediaMap["Profile Photo"].uri;
					if (picPath) {
						profilePicUrl = `${this.tempDir}/${picPath}`;
						// Handle profile picture
						// Copy to a permanent location if needed
						const permanentDir = `${FileSystem.documentDirectory}profile_pics/`;
						const dirExists = await FileSystem.getInfoAsync(permanentDir);
						if (!dirExists.exists) {
							await FileSystem.makeDirectoryAsync(permanentDir, {
								intermediates: true,
							});
						}

						const fileName = `profile_${stringMap.Username?.value || "user"}_${Date.now()}.jpg`;
						const newPath = `${permanentDir}${fileName}`;

						try {
							await FileSystem.copyAsync({
								from: profilePicUrl,
								to: newPath,
							});
							// Update the path to the permanent location
							profilePicUrl = newPath;
						} catch (error) {
							console.error("Failed to copy profile picture:", error);
							// If copy fails, keep the temporary path but log the error
						}
					}
				}

				return {
					username: this.fixDoubleEncodedEmoji(stringMap.Username?.value),
					fullName: this.fixDoubleEncodedEmoji(stringMap.Name?.value) || "",
					biography: this.fixDoubleEncodedEmoji(stringMap.Bio?.value) || "",
					profilePicUrl,
					followers,
					following,
					posts,
				};
			}

			throw new Error("Invalid profile format in the archive");
		} catch (error) {
			console.error("Error parsing profile data:", error);
			throw new Error("Failed to parse Instagram data");
		}
	}

	private fixDoubleEncodedEmoji(text: string): string {
		try {
			// First, convert the string to what JavaScript thinks are the raw bytes
			const bytes = [];
			for (let i = 0; i < text.length; i++) {
				bytes.push(text.charCodeAt(i));
			}

			// Then interpret those bytes as UTF-8
			return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
		} catch (e) {
			console.warn("Error fixing double-encoded emoji:", e);
			return text;
		}
	}
	private transformFollowers(
		followersData: any[],
	): { name: string; profileUrl: string }[] {
		const followers: { name: string; profileUrl: string }[] = [];

		if (!Array.isArray(followersData)) {
			console.warn("Followers data is not an array:", followersData);
			return followers;
		}

		for (const follower of followersData) {
			if (follower.string_list_data && follower.string_list_data.length > 0) {
				const data = follower.string_list_data[0];
				followers.push({
					name: data.value || "",
					profileUrl: data.href || "",
				});
			}
		}

		return followers;
	}

	private transformFollowing(
		followingData: any,
	): { name: string; profileUrl: string }[] {
		const following: { name: string; profileUrl: string }[] = [];

		if (
			!followingData.relationships_following ||
			!Array.isArray(followingData.relationships_following)
		) {
			console.warn("Following data format is unexpected:", followingData);
			return following;
		}

		for (const relation of followingData.relationships_following) {
			if (relation.string_list_data && relation.string_list_data.length > 0) {
				const data = relation.string_list_data[0];
				following.push({
					name: data.value || "",
					profileUrl: data.href || "",
				});
			}
		}

		return following;
	}

	private transformPosts(postsData: any): InstagramPost[] {
		const posts: InstagramPost[] = [];

		// Check if postsData has the expected structure
		if (!postsData || !Array.isArray(postsData)) {
			console.warn("Posts data format is unexpected:", postsData);
			return posts;
		}

		// Assuming the structure is similar to other Instagram exports
		// This would need adjustment when the actual structure is confirmed
		for (const post of postsData) {
			try {
				const mediaUrls: string[] = [];

				// Extract media URLs if available
				if (post.media && Array.isArray(post.media)) {
					for (const media of post.media) {
						if (media.uri) {
							// Convert relative paths to absolute
							const mediaPath = `${this.tempDir}/${media.uri}`;
							mediaUrls.push(mediaPath);
						}
					}
				}

				// Create post object
				posts.push({
					id:
						post.id ||
						`post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
					timestamp: post.creation_timestamp
						? new Date(post.creation_timestamp * 1000)
						: new Date(),
					mediaUrls,
					caption: post.caption?.text || "",
				});
			} catch (error) {
				console.error("Error transforming post:", error);
				// Continue processing other posts
			}
		}

		return posts;
	}

	private async storeProfile(profile: InstagramProfile): Promise<void> {
		// store locally
		await AsyncStorage.setItem(
			`profile_${profile.username}`,
			JSON.stringify(profile),
		);
	}

	private async cleanup(): Promise<void> {
		try {
			const dirInfo = await FileSystem.getInfoAsync(this.tempDir);
			if (dirInfo.exists) {
				await FileSystem.deleteAsync(this.tempDir, {
					idempotent: true,
				});
			}
		} catch (error) {
			console.error("Cleanup failed:", error);
		}
	}
}

export default function ImportScreen() {
	const [importing, setImporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [debugData, setDebugData] = useState<any>(null);
	const [importedProfile, setImportedProfile] =
		useState<InstagramProfile | null>(null);

	const handleImport = async () => {
		setImporting(true);
		setError(null);
		setDebugData(null);

		const importer = new InstagramArchiveHandler();
		const result = await importer.importArchive();

		if (!result.success) {
			setError(result.error || "Import failed");
		} else if (result.profile) {
			setImportedProfile(result.profile);
			console.log("Import successful:", result.profile.username);
			console.log("User's name: ", result.profile.fullName);
			// Navigate to profile view or update UI
		}

		setImporting(false);
	};

	const handleDebug = async () => {
		setImporting(true);
		setError(null);
		setDebugData(null);

		const importer = new InstagramArchiveHandler();
		const result = await importer.debugImport();

		if (!result.success) {
			setError(result.error || "Debug import failed");
		} else if (result.debugData) {
			setDebugData(result.debugData);
		}

		setImporting(false);
	};

	return (
		<ScrollView className="flex-1">
			<View className="flex justify-center items-center w-full p-4 mb-8">
				<Text className="text-xl font-bold mb-4">
					Instagram Archive Importer Debug Menu
				</Text>

				<Button
					className="bg-iguana-500 w-fit px-6 py-2 mb-4"
					onPress={handleImport}
					disabled={importing}
				>
					<Text>{importing ? "Importing..." : "Import from Instagram"}</Text>
				</Button>

				<Button
					className="bg-blue-500 w-fit px-6 py-2"
					onPress={handleDebug}
					disabled={importing}
				>
					<Text>{importing ? "Testing..." : "Debug Import"}</Text>
				</Button>

				{error && <Text className="text-red-500 mt-4">{error}</Text>}

				{importedProfile && (
					<View className="mt-4 p-4 bg-gray-100 rounded w-full">
						<Text className="font-bold mb-2">Imported Profile:</Text>
						<Text>Username: {importedProfile.username}</Text>
						<Text>Name: {importedProfile.fullName}</Text>
						<Text>Bio: {importedProfile.biography}</Text>
						<Text>Followers: {importedProfile.followers.length}</Text>
						<Text>Following: {importedProfile.following.length}</Text>
						<Text>Posts: {importedProfile.posts.length}</Text>
					</View>
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
