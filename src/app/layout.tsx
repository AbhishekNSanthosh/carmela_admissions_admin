import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/scss/main.scss";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carmel Polytechnic",
  description: "A template for Next.js applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
