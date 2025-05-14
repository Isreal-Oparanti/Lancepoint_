import BaseNoAuth from "@/components/base/withoutauth";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { OnchainProviders } from "./OnchainKitProviders";
// import { OnchainProviders } from "@/components/OnchainProviders";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        <BaseNoAuth>
          <OnchainProviders>{children}</OnchainProviders>
        </BaseNoAuth>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
