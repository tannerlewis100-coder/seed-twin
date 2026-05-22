import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/SignInForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Clarum" },
      { name: "description", content: "Create a Clarum account. Get 10% off your first order." },
    ],
  }),
  component: () => <SignInForm mode="signup" />,
});
