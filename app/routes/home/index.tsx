import * as React from "react";
// router
import { Outlet, useNavigate, useLocation } from "react-router";
// redux
import { useAppSelector } from "@/services/redux";
// components
import { LiveTicker } from "./_components/live-ticker";
import { ConverterForm } from "./_components/converter-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// icon
import Logo from "@/assets/images/logo.svg?react";
import { Container } from "@/components/custom/container";
import { ThemeSwitcher } from "@/components/custom/theme-switcher";
``;
export default function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const favoriteCount = useAppSelector((state) => state.fx.favorites.length);
  const logCount = useAppSelector((state) => state.fx.logs.length);

  // Sync tab selection value with current route path
  const currentTab = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/compare")) return "compare";
    if (path.startsWith("/favorites")) return "favorites";
    if (path.startsWith("/logs")) return "logs";
    return "history"; // default index / or /history
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    if (value === "history") {
      navigate("/history");
    } else {
      navigate(`/${value}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative antialiased overflow-x-hidden">
      {/* Background glass overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#cef739_0.5px,transparent_0.5px)] bg-size-[16px_16px] opacity-5 pointer-events-none" />

      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-4 py-5 px-6 select-none z-10">
        <div className="flex items-center w-auto mr-auto">
          <Logo />
        </div>
        <ThemeSwitcher />
        <div className="flex items-center gap-4 justify-end w-full sm:w-auto sm:justify-end">
          <div className="flex flex-1 sm:flex-auto items-center gap-1 text-xs sm:text-sm font-normal tracking-[1px] font-mono text-muted-foreground uppercase">
            <span>55 Currencies</span>
            <span>·</span>
            <span>EOD</span>
            <span>·</span>
            <span>ECB Data</span>
          </div>
        </div>
      </header>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Main Content Area */}
      <main className="flex-1 w-full space-y-8 z-10">
        {/* Converter Card Section */}
        <section className=" pt-8 lg:pt-12">
          <Container className="space-y-4 pb-0">
            <h2 className="font-normal leading-6 text-xl uppercase">
              Check the Rate
            </h2>
            <ConverterForm />
          </Container>
        </section>

        {/* Tab Subroute Area */}
        <section className="pb-8 lg:pb-12">
          <Container className="space-y-6 pt-0">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList
                variant="line"
                className="w-full border-b border-border/60 justify-start gap-8 px-0 h-10 bg-transparent rounded-none"
              >
                <TabsTrigger
                  value="history"
                  className="h-full border-b-2 border-transparent data-active:border-primary text-xs font-mono tracking-wider font-bold uppercase pb-3 px-1 data-active:text-primary transition-all rounded-none bg-transparent dark:data-active:bg-transparent"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="compare"
                  className="h-full border-b-2 border-transparent data-active:border-primary text-xs font-mono tracking-wider font-bold uppercase pb-3 px-1 data-active:text-primary transition-all rounded-none bg-transparent dark:data-active:bg-transparent"
                >
                  Compare
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="h-full border-b-2 border-transparent data-active:border-primary text-xs font-mono tracking-wider font-bold uppercase pb-3 px-1 data-active:text-primary transition-all rounded-none bg-transparent dark:data-active:bg-transparent gap-2"
                >
                  Favorites
                  {favoriteCount > 0 && (
                    <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-card border border-border/80 text-primary">
                      {favoriteCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="h-full border-b-2 border-transparent data-active:border-primary text-xs font-mono tracking-wider font-bold uppercase pb-3 px-1 data-active:text-primary transition-all rounded-none bg-transparent dark:data-active:bg-transparent gap-2"
                >
                  Log
                  {logCount > 0 && (
                    <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-card border border-border/80 text-primary">
                      {logCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Sub-route Content */}
            <div className="pt-2">
              <Outlet />
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
