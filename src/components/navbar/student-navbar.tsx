"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { title } from "process";
import { usePathname } from "next/navigation";

const routes = [
  {
    path: "/student",
    title: "Home",
  },
  {
    path: "/student/apply-for-leave",
    title: "Apply for Leave",
  },
  {
    path: "/student/applications",
    title: "Applications",
  },
  {
    path: "/student/application-status",
    title: "Check Status",
  },
];

// Navbar for Large Screen Devices
function LargeDeviceNavbar() {
  const pathname = usePathname();

  return (
    <section className="hidden md:flex md:w-full md:justify-between mb-5">
      <Link href="/student" legacyBehavior passHref>
        <Image
          src={"/wu-logo.png"}
          width={60}
          height={24}
          alt="Woxsen University Logo"
        />
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex w-full text-sm justify-start space-x-5 items-start">
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
        </NavigationMenuList>
      </NavigationMenu>
      <Link href="/student/login" legacyBehavior passHref>
        <Button className="bg-brand/85 hover:bg-brand">Logout</Button>
      </Link>
    </section>
  );
}

// Navbar for Mobile Devices
function SmallDeviceNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const handleToggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section className="flex w-full flex-col md:hidden mb-5">
      <div className="w-full flex justify-between items-center">
        <Link href="/student" legacyBehavior passHref>
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
              <NavigationMenuItem className="w-[100%]">
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
              <Link href="/student/login" legacyBehavior passHref>
                <Button className="bg-brand/85 hover:bg-brand">Logout</Button>
              </Link>
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

export default function StudentNavbar() {
  return (
    <>
      <LargeDeviceNavbar />
      <SmallDeviceNavbar />
    </>
  );
}
