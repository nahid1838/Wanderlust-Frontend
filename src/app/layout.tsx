import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { Footer } from "@/components/shared/footer";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wanderlast | Discover Your Next Adventure",
  description:
    "Explore breathtaking destinations and create unforgettable memories with our curated travel experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${josefinSans} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
