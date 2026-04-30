import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/SignInForm";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Create Account — Clarum" },
      { name: "description", content: "Create a Clarum account to access the COA library, batch records, and your order history." },
      { property: "og:title", content: "Create Account — Clarum" },
      { property: "og:description", content: "Get access to the COA library, batch records, and order history." },
    ],
  }),
  component: () => <SignInForm mode="signup" />,
});
