import { Toaster } from "react-hot-toast";
import { ConfigProvider } from "antd";

import "./globals.css";
import WalletContextProvider from "@/components/WalletContextProvider";
import Header from "@/components/Navbar/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-image w-full">
        <WalletContextProvider>
          <Header />

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#7a1bd2ff",
                colorPrimaryHover: "#4e088bff",
              },
            }}
          >

            {children}

          </ConfigProvider>
        </WalletContextProvider>

        <Toaster position="top-left" reverseOrder={false} />
      </body>
    </html>
  );
}