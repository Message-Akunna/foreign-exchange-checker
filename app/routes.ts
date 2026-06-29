import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/home/index.tsx", [
    index("routes/index.tsx"),
    route("history", "routes/history/index.tsx"),
    route("compare", "routes/compare/index.tsx"),
    route("favorites", "routes/favorites/index.tsx"),
    route("logs", "routes/logs/index.tsx"),
    route("login", "routes/auth/login/index.tsx"),
    route("register", "routes/auth/register/index.tsx"),
  ]),
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
