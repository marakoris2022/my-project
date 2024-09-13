import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { User } from "firebase/auth/web-extension";

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
    const { token }: { token: string } = await req.json();

    // // Set the token in a cookie
    const cookieStore = cookies();
    cookieStore.set("authToken", token, {
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
