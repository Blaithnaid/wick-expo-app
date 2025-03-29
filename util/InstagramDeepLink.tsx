export function createInstagramDeepLink({
	profileUrl,
	platform,
}: { profileUrl: string; platform: "ios" | "android" | "web" }) {
	// Extract the username from the profile URL
	const usernameMatch = profileUrl.match(/instagram\.com\/([^/]+)/);

	if (!usernameMatch) {
		throw new Error("Invalid Instagram profile URL");
	}

	const username = usernameMatch[1];

	switch (platform) {
		case "ios":
			return `instagram://user?username=${username}`;
		case "android":
			return `intent://instagram.com/${username}/#Intent;package=com.instagram.android;scheme=https;end`;
		case "web":
			return `https://www.instagram.com/${username}`;
	}

	return {
		universal: `https://www.instagram.com/${username}`,
		ios: `instagram://user?username=${username}`,
		android: `intent://instagram.com/${username}/#Intent;package=com.instagram.android;scheme=https;end`,
	};
}
