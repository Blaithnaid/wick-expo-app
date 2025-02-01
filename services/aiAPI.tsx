import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

export default async function chatWithGemini(
	prevMessages: { text: string; role: string }[],
	userMessage: string
) {
	try {
		// Combine previous messages with the new user message
		const contents = prevMessages.map((msg) => ({
			role: msg.role,
			parts: [{ text: msg.text }],
		}));
		contents.push({
			role: "user",
			parts: [{ text: userMessage }],
		});

		const response = await axios.post(
			`${API_URL}?key=${API_KEY}`,
			{
				contents: contents,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		// Extract the response data
		const responseData = response.data;

		// Extract the 'text' from the 'parts' in the response content
		const responseText =
			responseData.candidates[0]?.content?.parts[0]?.text || "";

		return responseText;
	} catch (error: any) {
		console.error(
			"Error:",
			error.response ? error.response.data : error.message
		);
		throw error;
	}
}

`
curl "" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [{
    "parts":[{"text": "Explain how AI works"}]
    }]
   }'
`;
