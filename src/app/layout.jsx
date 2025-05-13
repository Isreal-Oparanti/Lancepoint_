import "@coinbase/onchainkit/styles.css";
import BaseNoAuth from "@/components/base/withoutauth";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "@/lib/providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        <Providers>
          <BaseNoAuth>{children}</BaseNoAuth>
        </Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
