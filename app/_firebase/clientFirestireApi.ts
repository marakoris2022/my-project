// Save user data (POST)
export async function saveUserData(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
) {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, data }),
    });

    const result = await response.json();
    if (response.ok) {
      return result; // Return the result for further use if needed
    } else {
      console.error("Error saving user data:", result);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Fetch user data (GET)
export async function fetchUserData(userId: string) {
  try {
    const response = await fetch(
      `/api/user?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
      }
    );

    const result: Record<string, string>[] | null = await response.json();
    if (response.ok) {
      return result; // Return the data for further use
    } else {
      console.error("Error fetching user data:", result);
      return null;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}

// // Update user data (PATCH)
// export async function updateUserData(
//   docId: string,
//   newData: Record<string, string>
// ) {
//   try {
//     const response = await fetch("/api/user", {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ docId, newData }),
//     });

//     const result = await response.json();
//     if (response.ok) {
//       return result; // Return the result for further use
//     } else {
//       console.error("Error updating user data:", result);
//     }
//   } catch (error) {
//     console.error("Request failed:", error);
//   }
// }
