import { createFileRoute } from "@tanstack/react-router";
import { AdminPortal } from "@/components/admin/admin-portal";

export const Route = createFileRoute("/daman-private-portal")({
  head: () => ({
    meta: [
      { title: "Admin Portal | Daman Cyber Cafe Rajpura" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPortal,
});
