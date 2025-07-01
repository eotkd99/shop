import "./globals.css";
import HeaderWrapper from "../components/HeaderWrapper";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <HeaderWrapper />
        {children}
      </body>
    </html>
  );
}
