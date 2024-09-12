import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { auth } from "./firebaseConfig";

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    return userCredential.user;
  } catch (error) {
    console.log("error", error instanceof FirebaseError);

    if (error instanceof FirebaseError) {
      throw new Error(error.code);
    }
    throw new Error("Failed to register a new user.");
  }
}
