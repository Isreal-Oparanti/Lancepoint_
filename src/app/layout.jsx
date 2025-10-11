import { Toaster } from "react-hot-toast";
import "./globals.css";
import WalletContextProvider from "@/components/WalletContextProvider";
import Header from "@/components/Navbar/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-image w-full">
        <WalletContextProvider>
          <Header />
          {children}
        </WalletContextProvider>

        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}