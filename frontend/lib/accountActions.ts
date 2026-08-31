"use client";

import { promptForReauth } from "@/components/ReauthPrompt";

/**
 * Fetch wrapper that performs step-up reauthentication on 403:
 * - password accounts: confirm the current password;
 * - OAuth-only accounts: confirm a fresh OTP sent to the verified phone.
 *
 * Returns the final fetch Response, or a 499 response when the user cancels.
 */
export async function reauthFetch(
  path: string,
  token: string | null | undefined,
  body: Record<string, string> = {},
  method: "POST" | "PATCH" | "DELETE" = "POST",
): Promise<Response> {
  const attempt = (b: Record<string, string>) =>
    fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(b),
    });

  let res = await attempt(body);

  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    const message: string = data?.message ?? "";

    if (/otp|code sent|verified phone/i.test(message)) {
      const input = await promptForReauth("otp");
      if (!input?.otp) {
        return new Response(JSON.stringify({ cancelled: true }), { status: 499 });
      }
      res = await attempt({ ...body, otp: input.otp });
    } else {
      const input = await promptForReauth("password");
      if (!input?.currentPassword) {
        return new Response(JSON.stringify({ cancelled: true }), { status: 499 });
      }
      res = await attempt({ ...body, currentPassword: input.currentPassword });
    }
  }

  return res;
}

/**
 * Deletes the caller's account with step-up reauthentication.
 * Returns the fetch Response (or 499 when the user cancels the confirmation).
 */
export async function deleteAccountWithReauth(token?: string | null): Promise<Response> {
  return reauthFetch("/api/user/delete-account", token, {}, "DELETE");
}
