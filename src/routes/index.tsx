import { createFileRoute } from "@tanstack/react-router";
import { DamanCyberCafe } from "@/components/daman-cyber-cafe";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daman Cyber Cafe | Digital Services in Rajpura" },
      {
        name: "description",
        content:
          "Daman Cyber Cafe in Rajpura provides convenient online, digital and document-related services, including photocopying and document assistance.",
      },
      { property: "og:title", content: "Daman Cyber Cafe | Digital Services in Rajpura" },
      {
        property: "og:description",
        content: "Online, digital, photocopying and document assistance from your local service centre in Rajpura.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return <DamanCyberCafe />;
}
