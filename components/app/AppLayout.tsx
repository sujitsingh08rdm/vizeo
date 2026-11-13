"use client";

import { ChildrenInterface } from "@/interface/children-interface";
import {
  ArrowLeft,
  Clapperboard,
  CloudUpload,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import Logo from "../shared/Logo";
import Button from "../shared/Button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "cn";
import { useAuth } from "@/context/auth-context";

const APP_BASE = "/app";

const SIDEBAR_MENU = [
  {
    id: "01",
    href: `${APP_BASE}/dashboard`,
    label: "dashboard",
    icon: <LayoutDashboard />,
    matchBase: true,
  },
  {
    id: "02",
    href: `${APP_BASE}/videos`,
    label: "my videos",
    icon: <Clapperboard />,
  },
  {
    id: "03",
    href: `${APP_BASE}/upload`,
    label: "upload",
    icon: <CloudUpload />,
  },
  {
    id: "04",
    href: `${APP_BASE}/settings`,
    label: "settings",
    icon: <Settings />,
  },
];

const AppLayout = ({ children }: ChildrenInterface) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // md+  : collapsed = icons only, expanded = icons + labels
  const [collapsed, setCollapsed] = useState(false);
  // <md  : hidden by default, opens as an icon rail overlay
  const [mobileOpen, setMobileOpen] = useState(false);
  // <lg  : search shows as an icon, opens as a full-width bar
  const [searchOpen, setSearchOpen] = useState(false);

  // use auth
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/auth/login");
  }, [isLoading, isAuthenticated, router]);

  // Tablet (md to lg) starts with the icon rail, desktop starts expanded
  useEffect(() => {
    setCollapsed(!window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  // Close profile dropdown

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // closes the mobile rail on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // escape key to close the mobile rail and the search bar

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // One handler, behaviour depends on the breakpoint
  const handleMenuClick = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  };

  if (isLoading || !isAuthenticated) return null; // or a spinner

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* navbar */}
      <nav className="relative z-30 shrink-0 flex h-16 items-center justify-between border-b border-gray-200 p-4 ">
        {/* toggle feature + Logo */}
        <div
          className={cn(
            "lg:flex items-center gap-4",
            searchOpen ? "hidden" : "flex",
          )}
        >
          <button
            type="button"
            aria-label="Toggle sidebar"
            aria-expanded={mobileOpen}
            onClick={handleMenuClick}
            className="cursor-pointer text-gray-700 hover:text-gray-900"
          >
            <Menu />
          </button>

          <Link href="/app">
            <Logo />
          </Link>
        </div>

        {/* Search */}
        <div
          className={cn(
            "flex items-center gap-2",
            searchOpen ? "flex-1" : "flex-1 justify-end lg:justify-center mr-4",
          )}
        >
          {/* back button when search bar is open on <lg */}
          {searchOpen && (
            <button
              type="button"
              aria-label="close search"
              onClick={() => {
                setSearchOpen(false);
              }}
              className="block lg:hidden cursor-pointer text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft />
            </button>
          )}
          <input
            className={cn(
              "input-field w-full lg:max-w-lg",
              searchOpen ? "block" : "hidden lg:block",
            )}
            placeholder="Search"
            autoFocus={searchOpen}
          />

          {/* Search icon : only below lg and only when bar is closed */}
          {!searchOpen && (
            <button
              type="button"
              aria-label="open search"
              onClick={() => setSearchOpen(true)}
              className="block lg:hidden cursor-pointer text-gray-700 hover:text-gray-900"
            >
              <Search />
            </button>
          )}
        </div>

        {/* Upload + user Icon Feature */}
        <div
          className={cn(
            "items-center gap-4 lg:flex",
            searchOpen ? "hidden" : "flex",
          )}
        >
          <Link
            href={`${APP_BASE}/upload`}
            aria-label="Upload"
            className="sm:hidden text-gray-700 hover:text-gray-900"
          >
            <CloudUpload />
          </Link>
          <div className="hidden sm:block w-22">
            <Button className="cursor-pointer bg-indigo-400 hover:bg-indigo-500 px-4">
              <Link href={`${APP_BASE}/upload`} aria-label="Upload">
                Upload
              </Link>
            </Button>
          </div>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="cursor-pointer px-4 py-2 bg-indigo-200 rounded-full hover:ring-2 hover:ring-indigo-400"
            >
              <label className="cursor-pointer text-xl font-bold text-indigo-800 capitalize">
                {user?.fullname[0]}
              </label>
            </button>
            {showProfile && (
              <div className="w-25 sm:30 md:35 absolute p-2 mt-1 -right-1 border flex flex-col items-center justify-center bg-gray-100 rounded">
                <Link
                  href={"/app/settings"}
                  className="text-lg mb-1 hover: font-semibold"
                  onClick={() => setShowProfile(false)}
                >
                  {user?.fullname}
                </Link>
                <Button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 hover:text-gray-900 active:scale-95"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* sidebar+content */}
      <div className="relative flex flex-1 min-w-0 min-h-0">
        {/* backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 top-16 z-30 bg-black/30 md:hidden"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* sidebar */}
        <aside
          className={cn(
            "border-r border-gray-200 bg-white transition-all duration-300",
            // <md: fixed icon rail that slides in/out
            "fixed top-16 bottom-0 left-0 z-40 w-18",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            // md+: part of the flow, always visible, width depends on state
            "md:static md:z-auto md:h-full md:translate-x-0 md:shrink-0 md:overflow-y-auto",
            collapsed ? "md:w-18" : "md:w-64",
          )}
        >
          <ul className="p-4 flex flex-col gap-4">
            {SIDEBAR_MENU.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                (!!item.matchBase &&
                  (pathname === APP_BASE || pathname === `${APP_BASE}/`));

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "flex items-center gap-3 rounded-md p-3 capitalize transition-colors",
                      "justify-center",
                      !collapsed && "md:justify-start",
                      active
                        ? "bg-indigo-200 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <div>{item.icon}</div>
                    <div className={cn("hidden", !collapsed && "md:block")}>
                      {item.label}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        {/* main content */}
        <div className="flex flex-1 min-w-0 flex-col overflow-y-auto">
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 p-2 text-center border-t border-gray-200 text-sm text-gray-700">
        © 2026 Vizeo. All rights reserved.
      </footer>
    </div>
  );
};

export default AppLayout;
