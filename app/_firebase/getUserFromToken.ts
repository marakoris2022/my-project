import { getAuth, UserRecord } from "firebase-admin/auth";

export async function getUserFromToken(token: string) {
  const decodedIdToken = await getAuth().verifyIdToken(token);
  const userUid = decodedIdToken.uid;
  const user = (await getAuth().getUser(userUid)).toJSON();
  return user as UserRecord;
}
