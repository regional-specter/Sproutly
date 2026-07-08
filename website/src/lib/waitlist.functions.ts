import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabase } from "@/lib/supabase";

const joinWaitlistInput = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((email) => email.toLowerCase()),
});

export type JoinWaitlistResult = {
  ok: true;
  alreadyJoined: boolean;
};

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const parsed = joinWaitlistInput.safeParse(input);
    if (!parsed.success) {
      throw new Error(
        parsed.error.issues[0]?.message ?? "Enter a valid email address",
      );
    }
    return parsed.data;
  })
  .handler(async ({ data }): Promise<JoinWaitlistResult> => {
    const supabase = getSupabase();

    const { error } = await supabase.from("waitlist").insert({
      email: data.email,
      source: "website",
    });

    if (error) {
      // Unique violation — already signed up
      if (error.code === "23505") {
        return { ok: true, alreadyJoined: true };
      }

      console.error("waitlist insert failed", error.message, error.code);
      throw new Error("Could not join the waitlist. Please try again.");
    }

    return { ok: true, alreadyJoined: false };
  });
