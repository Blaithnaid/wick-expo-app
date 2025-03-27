import { InstagramPost, InstagramProfile } from "@/constants/Instagram";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
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
				posts = await this.transformPosts(postsData);
			}

			// Transform into our app's format using the new structure
			if (personalInfo.profile_user && personalInfo.profile_user.length > 0) {
				const profileUser = personalInfo.profile_user[0];
				const stringMap = profileUser.string_map_data || {};
				const mediaMap = profileUser.media_map_data || {};

				// Extract profile picture URL if available
				let profilePicUrl = "";
				if (mediaMap["Profile Photo"]) {
					console.log(mediaMap["Profile Photo"]);
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

						const fileName = `profile_${
							stringMap.Username?.value || "user"
						}_${Date.now()}.jpg`;
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
					id: `profile_${stringMap.Username?.value}_${Date.now()}`,
					username: this.fixDoubleEncodedEmoji(stringMap.Username?.value),
					fullName: this.fixDoubleEncodedEmoji(stringMap.Name?.value) || "",
					biography: this.fixDoubleEncodedEmoji(stringMap.Bio?.value) || "",
					profilePicUrl,
					followers,
					following,
					posts,
					whenImported: new Date(),
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

	private async transformPosts(postsData: any): Promise<InstagramPost[]> {
		const posts: InstagramPost[] = [];

		// Create permanent media directory
		const permanentMediaDir = `${FileSystem.documentDirectory}instagram_media/`;
		const dirExists = await FileSystem.getInfoAsync(permanentMediaDir);
		if (!dirExists.exists) {
			await FileSystem.makeDirectoryAsync(permanentMediaDir, {
				intermediates: true,
			});
		}

		if (!postsData || !Array.isArray(postsData)) {
			console.warn("Posts data format is unexpected:", postsData);
			return posts;
		}

		for (const post of postsData) {
			try {
				const mediaUrls: string[] = [];

				// Extract and copy media files if available
				if (post.media && Array.isArray(post.media)) {
					for (const media of post.media) {
						if (media.uri) {
							// Source path in temp directory
							const tempMediaPath = `${this.tempDir}/${media.uri}`;

							// Generate a unique filename for the permanent storage
							const fileName = `media_${Date.now()}_${Math.random()
								.toString(36)
								.substring(2, 9)}_${media.uri.split("/").pop()}`;
							const permanentPath = `${permanentMediaDir}${fileName}`;

							try {
								// Copy the file to permanent storage
								await FileSystem.copyAsync({
									from: tempMediaPath,
									to: permanentPath,
								});

								// Store the permanent path
								mediaUrls.push(permanentPath);
							} catch (copyError) {
								console.error("Failed to copy media file:", copyError);
								// If copy fails, don't add this media URL
							}
						}
					}
				}

				// Create post object with permanent media paths
				posts.push({
					id:
						post.id ||
						`post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
					timestamp: post.creation_timestamp
						? new Date(post.creation_timestamp * 1000)
						: new Date(),
					mediaUrls, // These now point to permanent locations
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
		await AsyncStorage.setItem(profile.id, JSON.stringify(profile));
		console.log("Stored profile:", profile.id);
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
