import { CookieOptions } from "express"

export function getCookieOptions(): CookieOptions {
  const now = new Date(Date.now())
  return {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    expires: new Date(now.setDate(now.getDate() + 7)),
  }
}
