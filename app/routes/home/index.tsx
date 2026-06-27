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
import Logo from "../_components/logo";
import { Container } from "@/components/custom/container";
import { ThemeSwitcher } from "@/components/custom/theme-switcher";
import { useCurrencies } from "@/services/queries/fx-queries";

export default function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: currencies } = useCurrencies();
  const currencyCount = currencies ? Object.keys(currencies).length : 0;

  const favoriteCount = useAppSelector((state) => state.fx.favorites.length);
  const logCount = useAppSelector((state) => state.fx.logs.length);

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative antialiased overflow-x-clip">
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
            <span>
              {currencies ? `${currencyCount} Currencies` : "0 Currencies"}
            </span>
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
              className="sticky top-10.5 z-20 bg-background border-b mb-5 w-full"
            >
              <TabsList
                variant="line"
                className="justify-start gap-2 px-0 bg-transparent rounded-none border-0 h-10.5!"
              >
                {tabItems.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="uppercase h-auto py-2 px-4 gap-2 after:bg-primary group-data-horizontal/tabs:after:-bottom-0.25"
                  >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="flex items-center justify-center size-5 rounded-full text-[10px] bg-primary/10 text-primary">
                        {tab.count}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Sub-route Content */}
            <div className="">
              <Outlet />
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
