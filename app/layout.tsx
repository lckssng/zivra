import type { Metadata } from "next";
import "./globals.css";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "zivra";
const basePath = process.env.GITHUB_PAGES === "true" ? `/${repositoryName}` : "";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Zivra | Maandelijkse voortgang",
  description: "Een eenvoudig patiëntenoverzicht voor CVA-revalidatie.",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
