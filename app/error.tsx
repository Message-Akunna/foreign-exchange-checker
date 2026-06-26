import { isRouteErrorResponse } from "react-router";
import { Container } from "@/components/custom/container";

interface ErrorBoundaryPageProps {
  error: unknown;
}

export function ErrorBoundaryPage({ error }: ErrorBoundaryPageProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="p-4 pt-16">
      <Container variant="breakpointPadded">
        <h1 className="text-2xl font-bold font-mono mb-4">{message}</h1>
        <p className="text-muted-foreground font-mono mb-6">{details}</p>
        {stack && (
          <pre className="w-full overflow-x-auto p-4 bg-muted border border-border/80 rounded-lg text-xs font-mono">
            <code>{stack}</code>
          </pre>
        )}
      </Container>
    </main>
  );
}
