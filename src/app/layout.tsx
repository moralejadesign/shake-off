import type { Metadata, Viewport } from "next";
import "./globals.css";

const description = "Having a rough day? Shake the ball and it gives you a meme to lift your mood.";

// The share images come from opengraph-image.jpg and twitter-image.jpg in this folder.
export const metadata: Metadata = {
  title: "Shake Off",
  description,
  openGraph: { title: "Shake Off", description, type: "website", siteName: "Shake Off" },
  twitter: { card: "summary_large_image", title: "Shake Off", description },
};

export const viewport: Viewport = {
  themeColor: "#2f7fd8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
