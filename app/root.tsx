import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ErrorBoundaryPage } from "./error";
// providers
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";

import type { Route } from "./+types/root";
import "./styles/app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <!-- Primary Meta Tags --> */}
        <title>Foreign Exchange Checker | Live FX Rates & Charts</title>
        <meta
          name="title"
          content="Foreign Exchange Checker | Live FX Rates & Charts"
        />
        <meta
          name="description"
          content="A premium Foreign Exchange (FX) Checker web application. Track real-time currency conversions, view interactive historical rates, and compare currencies side-by-side."
        />
        <meta
          name="keywords"
          content="foreign exchange, fx converter, currency converter, exchange rates, live fx, charting, comparison dashboard, appwrite"
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://foreign-exchange-checker-one.vercel.app"
        />
        <meta
          property="og:title"
          content="Foreign Exchange Checker | Live FX Rates & Charts"
        />
        <meta
          property="og:description"
          content="A premium Foreign Exchange (FX) Checker web application. Track real-time currency conversions, view interactive historical rates, and compare currencies side-by-side."
        />
        <meta
          property="og:image"
          content="https://foreign-exchange-checker-one.vercel.app/logo-dark.png"
        />

        {/* <!-- X (Twitter) --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://foreign-exchange-checker-one.vercel.app"
        />
        <meta
          property="twitter:title"
          content="Foreign Exchange Checker | Live FX Rates & Charts"
        />
        <meta
          property="twitter:description"
          content="A premium Foreign Exchange (FX) Checker web application. Track real-time currency conversions, view interactive historical rates, and compare currencies side-by-side."
        />
        <meta
          property="twitter:image"
          content="https://foreign-exchange-checker-one.vercel.app/logo-dark.png"
        />

        {/* <!-- Favicons & Icons --> */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body>
        <ReactQueryProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ReduxProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster richColors position="bottom-center" closeButton />
            </ReduxProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

import { AuthProvider } from "@/providers/auth-provider";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorBoundaryPage error={error} />;
}
