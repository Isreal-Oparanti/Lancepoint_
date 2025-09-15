import { Toaster } from "react-hot-toast";
import "./globals.css";
import WalletContextProvider from "@/components/WalletContextProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        <WalletContextProvider>{children}</WalletContextProvider>

        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
