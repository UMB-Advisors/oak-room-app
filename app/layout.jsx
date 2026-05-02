import "./globals.css";

export const metadata = {
  title: "Oak Room Houston",
  description: "A members' app for The Oak Room at The Post Oak Hotel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
