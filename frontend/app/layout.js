export const metadata = {
  title: "NebulaCore API Nexus",
  description: "Modern dashboard for NebulaCore API Nexus"
};

import "./globals.css";
import NavBar from "../components/NavBar";
import ToastHost from "../components/Toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <NavBar />
        <div className="max-w-4xl mx-auto p-6">{children}</div>
        <ToastHost />
      </body>
    </html>
  );
}

