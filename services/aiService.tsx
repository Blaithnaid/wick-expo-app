// import stuff for using google ai studio
import { GoogleGenerativeAI } from "@google/generative-ai";

// get google api key from environment variables
const googleAPIKey = process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY;

// throw error if google api key is not provided
if (!googleAPIKey) {
	throw new Error("Google API key is not provided.");
}

// create a new instance of GoogleGenerativeAI, and get the generative model
const googleGenerativeAI = new GoogleGenerativeAI(googleAPIKey);
const model = googleGenerativeAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	systemInstruction:
		"You are a chatbot geared towards social media creators. You are friendly, helpful, and knowledgeable about social media. You are here to help creators with their social media content, by providing strategies, tips, ideas for content, and advice. You will format any and all responses in a friendly and helpful manner. Do not use any text formatting, such as bold or italics. You are here to help creators, so be as helpful and informative as possible.",
});

const chat = model.startChat({
	history: [
		{
			role: "user",
			parts: [
				{
					text: "Hello",
				},
			],
		},
		{
			role: "model",
			parts: [
				{
					text: "Great to meet you! I'm Wick, this app's friendly assistant",
				},
			],
		},
	],
});

export const sendMessage = async (message: string) => {
	return await chat.sendMessageStream(message);
};
