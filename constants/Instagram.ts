export interface InstagramProfile {
	id: string;
	username: string;
	fullName: string;
	biography: string;
	profilePicUrl: string;
	followers: { name: string; profileUrl: string }[];
	following: { name: string; profileUrl: string }[];
	posts: InstagramPost[];
	whenImported: Date;
}

export interface InstagramPost {
	id: string;
	timestamp: Date;
	mediaUrls: string[];
	caption?: string;
}

// Optional: Add utility type for import status
export interface ImportStatus {
	success: boolean;
	profile?: InstagramProfile;
	error?: string;
}

export const exampleInstagramProfile: InstagramProfile = {
	id: "profile_example",
	username: "example_user",
	fullName: "Example User",
	biography:
		"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
	profilePicUrl: "https://picsum.photos/400",
	followers: [
		{ name: "follower1", profileUrl: "https://instagram.com/follower1" },
		{ name: "follower2", profileUrl: "https://instagram.com/follower2" },
		{ name: "follower3", profileUrl: "https://instagram.com/follower3" },
	],
	following: [
		{ name: "following1", profileUrl: "https://instagram.com/following1" },
		{ name: "following2", profileUrl: "https://instagram.com/following2" },
		{ name: "following3", profileUrl: "https://instagram.com/following3" },
		{ name: "following4", profileUrl: "https://instagram.com/following4" },
		{ name: "following5", profileUrl: "https://instagram.com/following5" },
	],
	posts: [
		{
			id: "1",
			timestamp: new Date("2023-01-01T12:00:00Z"),
			mediaUrls: ["https://picsum.photos/seed/post1/400"],
			caption: "Example caption 1",
		},
		{
			id: "2",
			timestamp: new Date("2023-01-02T12:00:00Z"),
			mediaUrls: ["https://picsum.photos/seed/post2/400"],
			caption: "Example caption 2",
		},
		{
			id: "3",
			timestamp: new Date("2023-01-02T12:00:00Z"),
			mediaUrls: ["https://picsum.photos/seed/post3/400"],
			caption: "Example caption 2",
		},
		{
			id: "4",
			timestamp: new Date("2023-01-02T12:00:00Z"),
			mediaUrls: ["https://picsum.photos/seed/post4/400"],
			caption: "Example caption 2",
		},
	],
	whenImported: new Date(),
};
