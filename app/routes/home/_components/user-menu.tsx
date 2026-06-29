"use client";

import { useNavigate, useLocation } from "react-router";
import { Heart, History, LogOut } from "lucide-react";

import { useAuth } from "@/providers/auth-provider";
import { useFavorites } from "@/services/queries/favorites";
import { useLogs } from "@/services/queries/logs";
import { initialsFromString } from "@/helpers/initials-from-string";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: favorites = [] } = useFavorites();
  const { data: logs = [] } = useLogs();

  const favoriteCount = favorites.length;
  const logCount = logs.length;

  if (!isAuthenticated || !user) {
    return (
      <Button
        size="xs"
        variant="primary"
        onClick={() =>
          navigate("/login", { state: { backgroundLocation: location } })
        }
        className="cursor-pointer font-semibold uppercase tracking-wider h-8"
      >
        Sign In
      </Button>
    );
  }

  const initials = initialsFromString(user.name, user.email);

  const handleNavigate = (path: string) => {
    navigate(`${path}${location.search}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-8 p-0 cursor-pointer overflow-hidden"
          >
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex gap-2 items-start p-2">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            {user.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="py-2 px-3 cursor-pointer"
            onClick={() => handleNavigate("/favorites")}
          >
            <Heart className="mr-2 size-4" />
            <span>Favorites</span>
            <span className="ml-auto flex items-center justify-center size-5 rounded-full text-[10px] bg-primary/10 text-primary">
              {favoriteCount}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2 px-3 cursor-pointer"
            onClick={() => handleNavigate("/logs")}
          >
            <History className="mr-2 size-4" />
            <span>Logs</span>
            <span className="ml-auto flex items-center justify-center size-5 rounded-full text-[10px] bg-primary/10 text-primary">
              {logCount}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout()}
          className="py-2 px-3 cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
