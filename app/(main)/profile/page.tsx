import { COOKIES_TOKEN_KEY_NAME } from "@/app/_constants/constants";
import { getUserFromToken } from "@/app/_firebase/getUserFromToken";
import { Box, Typography } from "@mui/material";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const token = cookies().get(COOKIES_TOKEN_KEY_NAME);
  let user = null;

  if (token) {
    user = await getUserFromToken(token.value);
  }

  if (!user)
    return (
      <Box>
        <Typography>No User Found</Typography>
      </Box>
    );

  return (
    <Box>
      <Typography>ProfilePage {user.displayName}</Typography>
    </Box>
  );
}
