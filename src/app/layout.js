import "./globals.css";

export const metadata = {
  title: "Employee Performance Analytics & ML Dashboard",
  description: "Performance trends dashboard with Daily, Weekly, Monthly views, K-Means clustering, and Linear Regression prediction.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
