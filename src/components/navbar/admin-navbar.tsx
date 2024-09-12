"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const routes = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/applications",
    title: "Applications",
  },
];

// Navbar for Large Screen Devices
function LargeDeviceNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/logout`,
        { method: "POST" }
      );

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
      }

      toast.success(json.message);
      router.replace("/admin/login");
    } catch (error) {
      console.log("ERROR : ", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <section className="hidden md:flex md:w-full md:justify-between mb-5">
      <Link href="/admin" legacyBehavior passHref>
        <Image
          src={"/wu-logo.png"}
          width={60}
          height={24}
          alt="Woxsen University Logo"
        />
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex w-full text-sm justify-start space-x-5 items-start">
          {routes.map(({ path, title }: { path: string; title: string }) => (
            <NavigationMenuItem>
              <Link href={path} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "text-sm hover:font-medium hover:text-brand transition-all duration-200",
                    path === pathname ? "text-brand font-medium" : ""
                  )}
                >
                  {title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Button className="bg-brand/85 hover:bg-brand" onClick={handleLogout}>
        Logout
      </Button>
    </section>
  );
}

// Navbar for Mobile Devices
function SmallDeviceNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleToggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/logout`,
        { method: "POST" }
      );

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
      }

      toast.success(json.message);
      router.replace("/admin/login");
    } catch (error) {
      console.log("ERROR : ", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <section className="flex w-full flex-col md:hidden mb-5">
      <div className="w-full flex justify-between items-center">
        <Link href="/admin" legacyBehavior passHref>
          <Image
            src={"/wu-logo.png"}
            width={50}
            height={24}
            alt="Woxsen University Logo"
          />
        </Link>
        <Button variant={"ghost"} onClick={handleToggleNavbar}>
          {isOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
        </Button>
      </div>

      {isOpen ? (
        <NavigationMenu className="w-full mt-5">
          <NavigationMenuList className="flex w-full flex-col justify-start space-y-5 items-start">
            {routes.map(({ path, title }) => (
              <NavigationMenuItem>
                <Link href={path} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "text-sm hover:font-medium hover:text-brand transition-all duration-200",
                      path === pathname ? "text-brand font-medium" : ""
                    )}
                  >
                    {title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <Button
                className="bg-brand/85 hover:bg-brand"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ) : null}
    </section>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function AdminNavbar() {
  return (
    <>
      <LargeDeviceNavbar />
      <SmallDeviceNavbar />
    </>
  );
}
