import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/SignInForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Clarum" },
      { name: "description", content: "Sign in to access your COA library, order history, and batch records." },
    ],
  }),
  component: () => <SignInForm mode="signin" />,
});
