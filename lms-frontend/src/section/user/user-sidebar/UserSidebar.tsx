import React, { Fragment, useState } from "react";
import {
  MdOutlineDashboardCustomize,
  MdOutlinePeople,
  MdOutlineAttachMoney,
  MdOutlineSchool,
  MdOutlinePerson,
} from "react-icons/md";
import { FaSteam } from "react-icons/fa";
import {
  AlignVerticalJustifyEnd,
  Contact,
  Gem,
  Layers,
  Speech,
  TableProperties,
  Users,
  Users2,
  Layers2,
  UserCog,
  Video,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import UserMobileSidebar from "./UserMobileSidebar";
import UserDesktopSidebar from "./UserDesktopSidebar";

const navigation = [
  {
    name: "Dashboard",
    href: "/instructor",
    id: 1,
    icon: MdOutlineDashboardCustomize,
    current: false,
  },
  {
    name: "My Courses",
    href: "/instructor/courses",
    icon: Contact,
    current: false,
    id: 2,
  },
  {
    name: "Earnings",
    href: "/instructor/earnings",
    icon: MdOutlineAttachMoney,
    current: false,
    id: 3,
  },
  {
    name: "Student's",
    href: "/instructor/students",
    icon: MdOutlinePeople,
    current: false,
    id: 4,
  },
  {
    name: "Profile",
    href: "/user/profile",
    icon: MdOutlinePerson,
    current: false,
    id: 5,
  },
];

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function UserSidebar({ sidebarOpen, setSidebarOpen }: any) {
  const pathName = usePathname();
  const [activeMenuItem, setActiveMenuItem] = useState(1);
  const router = useRouter();
  const handleNavmenu = (item: any) => {
    if (item.id === activeMenuItem) {
      setActiveMenuItem(0);
      router.push(item.href);
      setSidebarOpen(false);
      return;
    }
    setActiveMenuItem(item.id);
    router.push(item.href);
    if (!item?.submenu || item?.submenu?.length === 0) {
      setSidebarOpen(false);
    }
  };
  const handleSubmenu = (item: any) => {
    if (!item.href) {
      return;
    }
    router.push(item.href);
    setSidebarOpen(false);
  };
  return (
    <>
      <UserMobileSidebar
        navigation={navigation}
        classNames={classNames}
        teams={teams}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        handleNavmenu={handleNavmenu}
        activeMenuItem={activeMenuItem}
        handleSubmenu={handleSubmenu}
        pathName={pathName}
      />

      <UserDesktopSidebar
        navigation={navigation}
        classNames={classNames}
        teams={teams}
        handleNavmenu={handleNavmenu}
        activeMenuItem={activeMenuItem}
        handleSubmenu={handleSubmenu}
        pathName={pathName}
      />
    </>
  );
}
