// app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserData, upsertUserData } from "@/app/_firebase/firestoreAPI";

export async function POST(req: NextRequest) {
  try {
    const { userId, data } = await req.json();
    const docId = await upsertUserData(userId, data);
    return NextResponse.json(
      { message: "User data added successfully", docId },
      { status: 200 }
    );
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
    if (userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}

// // Метод PATCH для обновления данных пользователя
// export async function PATCH(req: NextRequest) {
//   try {
//     const { docId, newData } = await req.json();

//     if (!docId || !newData) {
//       return NextResponse.json(
//         { error: "docId and newData are required" },
//         { status: 400 }
//       );
//     }

//     await updateUserData(docId, newData);
//     return NextResponse.json(
//       { message: "User data updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error updating user data" },
//       { status: 500 }
//     );
//   }
// }
