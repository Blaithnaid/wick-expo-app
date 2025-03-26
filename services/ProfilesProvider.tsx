import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InstagramProfile } from "@/constants/Instagram";
import * as FileSystem from "expo-file-system";

interface ProfileContextType {
	profiles: InstagramProfile[];
	loadProfiles: () => Promise<void>;
	clearProfiles: () => Promise<void>;
	deleteProfile: (profileId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [profiles, setProfiles] = useState<InstagramProfile[]>([]);

	const loadProfiles = useCallback(async () => {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const profileKeys = keys.filter((key) => key.startsWith("profile_"));
			const profilePromises = profileKeys.map(async (key) => {
				const profileData = await AsyncStorage.getItem(key);
				if (profileData) {
					const profile = JSON.parse(profileData) as InstagramProfile;
					profile.posts = profile.posts.map((post: any) => ({
						...post,
						timestamp: new Date(post.timestamp),
					}));
					profile.whenImported = new Date(profile.whenImported);
					return profile;
				}
				return null;
			});
			const profiles = await Promise.all(profilePromises);
			setProfiles(
				profiles.filter((profile) => profile !== null) as InstagramProfile[],
			);
		} catch (error) {
			console.error("Error loading profiles:", error);
		}
	}, []);

	const deleteProfile = async (profileId: string) => {
		try {
			console.log("Deleting profiles:", profileId);
			await AsyncStorage.removeItem(profileId);
		} catch (error) {
			console.error("Error deleting profiles:", error);
		}
	};

	const clearProfiles = async () => {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const profileKeys = keys.filter((key) => key.startsWith("profile_"));
			profileKeys.forEach((key) => {
				AsyncStorage.removeItem(key);
			});

			const mediaDir = `${FileSystem.documentDirectory}instagram_media/`;
			const profilePicsDir = `${FileSystem.documentDirectory}profile_pics/`;

			await FileSystem.deleteAsync(mediaDir, { idempotent: true });
			await FileSystem.deleteAsync(profilePicsDir, { idempotent: true });
			console.log("Successfully deleted profiles!");
		} catch (error) {
			console.log("Error clearing profiles:", error);
		}
	};

	useEffect(() => {
		loadProfiles();
	}, [loadProfiles]);

	return (
		<ProfileContext.Provider
			value={{ profiles, loadProfiles, clearProfiles, deleteProfile }}
		>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfiles = () => {
	const context = useContext(ProfileContext);
	if (!context) {
		throw new Error("useProfiles must be used within a ProfileProvider");
	}
	return context;
};
