import { Text, View } from "@/components/Themed";
import { Button } from "@/components/ui/button";
import { InstagramProfile } from "@/constants/Instagram";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome5 } from "@expo/vector-icons";
import { Platform } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useProfiles } from "@/services/ProfilesProvider";
const InstagramArchiveHandler =
	Platform.OS !== "web"
		? require("@/util/InstagramArchiveHandler").InstagramArchiveHandler
		: null;

export default function ImportScreen() {
	const [importing, setImporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [debugData, setDebugData] = useState<any>(null);
	const [importedProfile, setImportedProfile] =
		useState<InstagramProfile | null>(null);
	const profiles = useProfiles();
	const colorScheme = useColorScheme().colorScheme;

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
		}

		setImporting(false);
		if (result.success) {
			router.dismiss();
			profiles.loadProfiles();
		}
	};

	return (
		<View className="flex justify-center items-center w-full h-full p-4 mb-8">
			<View className="flex-1 items-center justify-start mt-28 px-5 flex">
				<FontAwesome5
					name="file-import"
					size={80}
					color={colorScheme === "dark" ? "white" : "black"}
				/>
				<View className="mt-4 mb-3 h-[2px] rounded-full w-[55%] bg-slate-400" />
				<Text className="text-xl text-center font-bold text-lavender-800">
					Want to take some time off Instagram?
				</Text>
				<Text className="text-xl text-center font-bold text-lavender-800">
					Import your data here!
				</Text>
				<Text className="text-lg text-center mt-4">
					Click the icon in the top right to find out how to get an export of
					your data, and then press below once you've received it!
				</Text>
				<View className="flex mt-8 flex-row gap-2">
					<Button
						className="bg-iguana-500 w-2/3 h-20 px-6 py-2 mb-8"
						onPress={handleImport}
						disabled={importing}
					>
						<Text className="text-xl font-bold text-center">
							{importing ? "Importing..." : "Import from Instagram"}
						</Text>
					</Button>
				</View>
			</View>

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
	);
}
