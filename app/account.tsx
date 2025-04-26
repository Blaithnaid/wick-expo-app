import { SafeAreaView, ScrollView, Text, View } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useAuthContext } from "@/services/AuthProvider";
import { useFirebaseContext } from "@/services/FirebaseProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import Head from "expo-router/head";
import { sendPasswordResetEmail } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { Alert, Pressable, Platform } from "react-native";

export default function AccountSettings() {
	const auth = useAuthContext();
	const firebase = useFirebaseContext();
	const profile = auth.profile;

	const [didSubmit, setDidSubmit] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [photoURL, setPhotoURL] = useState(auth.user?.photoURL || null);

	const [displayName, setDisplayName] = useState(profile?.displayName || "");
	const [fullName, setFullName] = useState(profile?.fullName || "");
	const [editLoading, setEditLoading] = useState(false);

	useEffect(() => {
		setDisplayName(profile?.displayName || "");
		setFullName(profile?.fullName || "");
	}, [profile]);

	const handlePasswordReset = async () => {
		await sendPasswordResetEmail(firebase.myAuth, profile?.email);
		setDidSubmit(true);
	};

	const handlePickImage = async () => {
		if (!auth.user) {
			console.error("User is not authenticated");
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});
		if (!result.canceled && result.assets && result.assets.length > 0) {
			setUploading(true);
			try {
				const asset = result.assets[0];
				const response = await fetch(asset.uri);
				const blob = await response.blob();
				const storageRef = ref(
					firebase.myStorage,
					`profilePictures/${auth.user?.uid || "defaultUser"}.jpg`,
				);
				await uploadBytes(storageRef, blob);
				const downloadURL = await getDownloadURL(storageRef);

				// Update Auth photoURL
				await updateProfile(auth.user, { photoURL: downloadURL });
				setPhotoURL(downloadURL);

				// Update Firestore user doc
				const userDocRef = doc(firebase.myFS, "users", auth.user.uid);
				await updateDoc(userDocRef, { photoURL: downloadURL });
			} catch (e) {
				console.error("Error uploading image:", e);
			} finally {
				setUploading(false);
			}
		}
	};

	const handleEditAccount = async () => {
		if (!auth.user) return;
		setEditLoading(true);
		try {
			await updateProfile(auth.user, { displayName });
			const userDocRef = doc(firebase.myFS, "users", auth.user.uid);
			await updateDoc(userDocRef, { displayName, fullName });
			Alert.alert("Success", "Account updated successfully.");
		} catch (e) {
			console.error("Error updating account:", e);
			Alert.alert("Error", "Failed to update account.");
		} finally {
			setEditLoading(false);
		}
	};

	if (!auth.profile) {
		return (
			<SafeAreaView className="flex-1 bg-white">
				<Text className="text-red-500 text-center mt-5">
					No profile information available.
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<>
			{Platform.OS === "web" ? (
				<Head>
					<title>Account Settings | Wick</title>
				</Head>
			) : null}
			<SafeAreaView className="flex-1 bg-white">
				<ScrollView className="web:max-w-3xl self-center px-12 pt-10">
					<View className="mb-6">
						{/* profile picture */}
						<View className="bg-gray-300 dark:bg-slate-900 overflow-hidden rounded-full size-32 flex items-center justify-center self-center">
							{photoURL ? (
								<Image
									source={{ uri: photoURL }}
									style={{
										width: 120,
										height: 120,
										borderRadius: 64,
										alignSelf: "center",
									}}
								/>
							) : (
								<FontAwesome
									name="user"
									size={120}
									color={"gray"}
									className="rounded-full"
								/>
							)}
						</View>
						<Pressable
							className="self-center mt-2"
							onPress={handlePickImage}
							disabled={uploading}
						>
							<Text className="text-sm font-bold text-lavender-300 dark:text-lavender-300">
								{uploading ? "Uploading..." : "Change profile picture"}
							</Text>
						</Pressable>
						<Text className="text-lg text-center font-bold m-6">
							Welcome to your account, {displayName}!
						</Text>
						<View className="mb-4">
							<Text className="text-md text-gray-700 font-bold mb-1">
								Username
							</Text>
							<Input variant="outline" size="md">
								<InputField
									className="dark:text-gray-200"
									value={displayName}
									onChangeText={setDisplayName}
									editable={!editLoading}
								/>
								<FontAwesome
									name="address-card"
									size={20}
									color={"#ffffff"}
									className="rounded-full mr-3"
								/>
							</Input>
						</View>
						<View className="mb-4">
							<Text className="text-md text-gray-700 font-bold mb-1">
								Full Name
							</Text>
							<Input variant="outline" size="md">
								<InputField
									className="dark:text-gray-200"
									value={fullName}
									onChangeText={setFullName}
									editable={!editLoading}
								/>
								<FontAwesome
									name="user"
									size={20}
									color={"#ffffff"}
									className="rounded-full mr-3"
								/>
							</Input>
						</View>
						<View className="mb-4">
							<Text className="text-md text-gray-700 dark:text-gray-200 font-bold mb-1">
								Email
							</Text>
							<Input variant="outline" size="md">
								<InputField
									className="dark:text-gray-200"
									value={auth.profile.email}
									editable={false}
								/>
								<FontAwesome
									name="envelope"
									size={20}
									color={"#ffffff"}
									className="rounded-full mr-3"
								/>
							</Input>
						</View>
					</View>
					<View className="w-3/4 gap-8 self-center">
						<Button
							onPress={() => {
								handlePasswordReset();
							}}
							className="bg-gray-400 dark:bg-gray-600"
						>
							<ButtonText className="dark:text-white">
								Reset Password
							</ButtonText>
						</Button>
						<Button
							onPress={handleEditAccount}
							className="bg-iguana-400 dark:bg-iguana-400"
							disabled={editLoading}
						>
							<ButtonText className="dark:text-white">
								{editLoading ? "Saving..." : "Edit Account"}
							</ButtonText>
						</Button>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	);
}
