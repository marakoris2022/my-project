import { cookies } from "next/headers";

export function removeCookies(key: string) {
  cookies().delete(key);
}
