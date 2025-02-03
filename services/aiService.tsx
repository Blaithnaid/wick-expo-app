// import stuff for using google ai studio
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebaseService";

const chatWithGemini = httpsCallable(functions, "chatWithGemini");

export const sendMessage = async (
	message: string,
	prevMessages: { text: string; role: string }[]
) => {
	try {
		const result = await chatWithGemini({
			prevMessages: prevMessages,
			userMessage: message,
		});

		return result.data;
	} catch (error) {
		console.error("Error calling function:", error);
	}
};
