import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { COOKIES_TOKEN_KEY_NAME } from "@/app/_constants/constants";
import { getUserFromToken } from "@/app/_firebase/getUserFromToken";

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
    const { token, name } = await req.json();

    const userRecord = await getUserFromToken(token);

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
    // Handle other errors
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
