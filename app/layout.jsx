import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "AIO Radar - AI Visibility Tracking",
  description: "Track your brand visibility inside Google AI Overviews",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
