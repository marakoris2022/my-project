import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { COOKIES_TOKEN_KEY_NAME } from "@/app/_constants/constants";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Ensure private key is correctly formatted
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Create a new user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Generate a custom token for the user
    const token = await admin.auth().createCustomToken(userRecord.uid);

    admin.auth().updateUser(userRecord.uid, {
      displayName: name,
    });

    // Set the token in a cookie
    const cookieStore = cookies();
    cookieStore.set(COOKIES_TOKEN_KEY_NAME, token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // Adjust based on your requirements
      path: "/", // Set the path for the cookie
    });

    return NextResponse.json({ message: "User created successfully", token });
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    // Handle other errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
