// plugins/firebase.client.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // ✅ Get credentials from .env
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  };

  // ✅ Check if credentials exist
  if (!firebaseConfig.apiKey) {
    console.error("❌ Firebase credentials missing in .env file!");
    return;
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // ✅ Configure Google Provider
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Configure Facebook Provider
  const facebookProvider = new FacebookAuthProvider();
  facebookProvider.setCustomParameters({
    display: 'popup'
  });

  return {
    provide: {
      firebaseAuth: auth,
      googleProvider,
      facebookProvider
    }
  };
});