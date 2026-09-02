"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

/**
 * Server action behind the login form (`<form action={login}>`).
 *
 * `signIn()` with the default `redirect: true` throws a NEXT_REDIRECT on
 * success — Next re-throws it and navigates. A failed credentials check
 * throws CredentialsSignin, which we turn into a message for the form.
 */
export async function login(_prev: string | undefined, formData: FormData): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
    return undefined;
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") return "Неверный логин или пароль";
      return "Ошибка входа. Попробуйте ещё раз";
    }
    throw err;
  }
}
