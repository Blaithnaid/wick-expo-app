import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import firebaseConfig from "./firebaseConfig.json";

// right now this file is only used for cloud functions
// the only cloud function we're actually running is for interacting with wickbot

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export what we need
export const functions = getFunctions(app);
export default app;
