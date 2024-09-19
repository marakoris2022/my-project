import { PokemonProfileProps } from "../_pokemonApi/pokemonDataApi";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"; // Default to '/api' if env variable is not set

// Save user data (POST)
export async function saveUserData(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
) {
  try {
    const response = await fetch(apiUrl + "/user", {
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
      `${apiUrl}/user?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
      }
    );

    const result: PokemonProfileProps | null = await response.json();
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

// Delete user data (DELETE)
export async function deleteUserFromDB(userId: string) {
  try {
    const response = await fetch(
      `${apiUrl}/user?userId=${encodeURIComponent(userId)}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    if (response.ok) {
      return result; // Return the result if further use is needed
    } else {
      console.error("Error deleting user data:", result);
      return null;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}
