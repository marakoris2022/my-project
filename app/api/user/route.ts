// app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  deleteUserData,
  getUserData,
  upsertUserData,
} from "@/app/_firebase/firestoreAPI";

export async function POST(req: NextRequest) {
  try {
    const { userId, data } = await req.json();
    const docId = await upsertUserData(userId, data);

    const response = NextResponse.json(
      { message: "User data added successfully", docId },
      { status: 200 }
    );
    response.headers.set("Cache-Control", "no-store"); // отключает кеширование

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding user data" },
      { status: 500 }
    );
  }
}

// Метод GET для получения данных пользователя
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userData = await getUserData(userId);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(userData, { status: 200 });
    response.headers.set("Cache-Control", "no-store"); // отключает кеширование

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}

// Метод DELETE для обновления данных пользователя
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Call your function to delete the user data
    await deleteUserData(userId);

    const response = NextResponse.json(
      { message: "User data deleted successfully" },
      { status: 200 }
    );
    response.headers.set("Cache-Control", "no-store"); // отключает кеширование

    return response;
  } catch (error) {
    console.error("Error deleting user data:", error);
    return NextResponse.json(
      { error: "Error deleting user data" },
      { status: 500 }
    );
  }
}
