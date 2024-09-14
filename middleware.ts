import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIES_TOKEN_KEY_NAME } from "./app/_constants/constants";

// Middleware function
export async function middleware(request: NextRequest) {
  const tokenFromCookie = request.cookies.get(COOKIES_TOKEN_KEY_NAME);
  const path = request.nextUrl.pathname;

  // Пути, которые не должны быть доступны авторизованным пользователям
  const publicPaths = ["/", "/sign-in", "/sign-up"];
  const privatePaths = ["/profile"];

  // Если пользователь не авторизован, перенаправляем на главную страницу
  if (!tokenFromCookie && privatePaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Если пользователь авторизован и пытается зайти на публичные страницы, перенаправляем на /profile
  if (tokenFromCookie && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

// // Config to match specific paths
// export const config = {
//   matcher: [], // Применение middleware для указанных путей
// };
