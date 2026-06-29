import * as React from "react";
// router
import { Outlet, useNavigate, useLocation } from "react-router";
// queries
import { useFavorites } from "@/services/queries/favorites";
import { useLogs } from "@/services/queries/logs";
// components
import { LiveTicker } from "./_components/live-ticker";
import { ConverterForm } from "./_components/converter-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// icon
import Logo from "../_components/logo";
import { Container } from "@/components/custom/container";
import { ThemeSwitcher } from "@/components/custom/theme-switcher";
import { useCurrencies } from "@/services/queries/fx";

// Auth & Pages imports
import { AuthModal } from "@/routes/auth/_components/auth-modal";
import HistoryPage from "@/routes/history";
import ComparePage from "@/routes/compare";
import FavoritesPage from "@/routes/favorites";
import LogsPage from "@/routes/logs";
import { UserMenu } from "./_components/user-menu";

export default function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: currencies } = useCurrencies();
  const currencyCount = currencies ? Object.keys(currencies).length : 0;

  const { data: favorites = [] } = useFavorites();
  const { data: logs = [] } = useLogs();

  const favoriteCount = favorites.length;
  const logCount = logs.length;

  const tabItems = [
    {
      value: "history",
      label: "History",
    },
    {
      value: "compare",
      label: "Compare",
    },
    {
      value: "favorites",
      label: "Favorites",
      count: favoriteCount,
    },
    {
      value: "logs",
      label: "Log",
      count: logCount,
    },
  ];

  // Sync tab selection value with current route path
  const currentTab = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/compare")) return "compare";
    if (path.startsWith("/favorites")) return "favorites";
    if (path.startsWith("/logs")) return "logs";
    return "history"; // default index / or /history
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    const search = location.search;
    if (value === "history") {
      navigate(`/history${search}`);
    } else {
      navigate(`/${value}${search}`);
    }
  };

  console.log("HomeLayout state check:", {
    pathname: location.pathname,
    state: location.state,
    backgroundLocation: location.state?.backgroundLocation,
  });

  const isStandaloneAuthPage =
    !location.state?.backgroundLocation &&
    (location.pathname === "/login" || location.pathname === "/register");

  if (isStandaloneAuthPage) {
    return <Outlet />;
  }

  const backgroundLocation = location.state?.backgroundLocation;

  const renderBackgroundPage = (pathname: string) => {
    if (pathname.startsWith("/compare")) return <ComparePage />;
    if (pathname.startsWith("/favorites")) return <FavoritesPage />;
    if (pathname.startsWith("/logs")) return <LogsPage />;
    return <HistoryPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative antialiased overflow-x-clip">
      {/* Background glass overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#cef739_0.5px,transparent_0.5px)] bg-size-[16px_16px] opacity-5 pointer-events-none" />

      {/* Top Header */}
      <header className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-4 px-6 py-5 select-none z-10 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <div className="min-w-0">
          <Logo />
        </div>

        <div className="order-3 col-span-2 flex items-center gap-1 text-xs sm:order-2 sm:col-span-1 sm:text-sm font-normal tracking-[1px] font-mono text-muted-foreground uppercase">
          <span>
            {currencies ? `${currencyCount} Currencies` : "0 Currencies"}
          </span>
          <span>·</span>
          <span>EOD</span>
          <span>·</span>
          <span>ECB Data</span>
        </div>

        <div className="order-2 flex shrink-0 items-center justify-end gap-3 sm:order-3">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </header>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Main Content Area */}
      <main className="flex-1 w-full space-y-8 z-10">
        {/* Converter Card Section */}
        <section className="pt-8 lg:pt-12">
          <Container className="space-y-4 pb-0">
            <h2 className="font-normal leading-6 text-xl uppercase">
              Check the Rate
            </h2>
            <ConverterForm />
          </Container>
        </section>

        {/* Tab Subroute Area */}
        <section className="pb-5 lg:pb-5">
          <Container className="space-y-6 pt-0">
            <Tabs
              value={currentTab}
              onValueChange={handleTabChange}
              className="sticky top-10.5 z-20 mb-5 w-full border-b bg-background"
            >
              <div className="overflow-x-auto scrollbar-none">
                <TabsList
                  variant="line"
                  className="inline-flex min-w-max justify-start gap-2 rounded-none border-0 bg-transparent px-0 h-10.5!"
                >
                  {tabItems.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="shrink-0 uppercase py-2 px-4 gap-2 h-auto after:bg-primary group-data-horizontal/tabs:after:-bottom-0.25 group-data-horizontal/tabs:after:h-0.25"
                    >
                      {tab.label}

                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                          {tab.count}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>

            {/* Sub-route Content */}
            <div className="">
              {backgroundLocation ? (
                <>
                  {renderBackgroundPage(backgroundLocation.pathname)}
                  <AuthModal>
                    <Outlet />
                  </AuthModal>
                </>
              ) : (
                <Outlet />
              )}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
