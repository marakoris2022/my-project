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

export async function GET() {
  try {
    // // Set the token in a cookie
    const cookieStore = cookies();
    cookieStore.delete(COOKIES_TOKEN_KEY_NAME);

    return NextResponse.json({ message: "Remove user data from Cookies" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
