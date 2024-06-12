import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDi6t2xKxKwkjRC7OKT4ldveLjJkpBmjXI",
  authDomain: "code-grounds-online-42bae.firebaseapp.com",
  projectId: "code-grounds-online-42bae",
  storageBucket: "code-grounds-online-42bae.appspot.com",
  messagingSenderId: "404902639094",
  appId: "1:404902639094:web:ec28ee1b593e559a99c3d7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();
const database = getDatabase(app);

export {database, auth, googleProvider, gitHubProvider};