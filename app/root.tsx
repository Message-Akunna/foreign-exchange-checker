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

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorBoundaryPage error={error} />;
}
