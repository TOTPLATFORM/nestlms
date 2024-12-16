import React, { Fragment, useState } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";
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
  GraduationCap,
  Settings,
  Settings2,
  UserCheck,
  UserCog,
  FileCog,
  MessageCircleIcon,
  Tag,
} from "lucide-react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FaSteam } from "react-icons/fa";
import {
  FaRegNewspaper,
  FaRegQuestionCircle,
  FaRegMoneyBillAlt,
  FaRegFileAlt,
  FaRegSmile,
  FaRegIdCard,
  FaRegListAlt,
  FaRegCaretSquareUp,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    id: 1,
    icon: MdOutlineDashboardCustomize,
    current: false,
  },
  {
    name: "Users",
    href: "#",
    id: 2,
    icon: Contact,
    current: true,
    submenu: [
      {
        name: "Admins",
        href: "/admin/lists",
        icon: UserCog,
        current: false,
      },
      {
        name: "Student's",
        href: "/admin/students",
        icon: UserCog,
        current: false,
      },
      {
        name: "Instructors",
        href: "/admin/instructors",
        icon: UserCog,
        current: false,
      },
      {
        name: "Pending Instructors",
        href: "/admin/instructors/pending",
        icon: UserCog,
        current: false,
      },
    ],
  },
  {
    name: "Category Management",
    href: "#",
    id: 3,
    icon: TableProperties,
    current: false,
    submenu: [
      {
        name: "Categories",
        href: "/admin/categories",
        icon: TableProperties,
        current: false,
      },
      {
        name: "Sub-Categories",
        href: "/admin/sub-categories",
        icon: TableProperties,
        current: false,
      },
    ],
  },
  {
    name: "Courses",
    href: "#",
    id: 9,
    icon: FaRegFileAlt,
    current: false,
    submenu: [
      {
        name: "All Courses",
        href: "/admin/courses",
        icon: FaRegListAlt,
        current: false,
      },
      {
        name: "Pending Courses",
        href: "/admin/pending-courses",
        icon: FaRegListAlt,
        current: false,
      },
    ],
  },

  {
    name: "Instructors Wallets",
    href: "/admin/instructors-wallets",
    id: 12,
    icon: MdOutlineDashboardCustomize,
    current: false,
  },

  {
    name: "Reports",
    href: "#",
    id: 5,
    icon: Layers,
    current: false,
    submenu: [
      {
        name: "Course Enrollment ",
        href: "/admin/reports/course-enrollment",
        icon: FaRegListAlt,
        current: false,
      },
      {
        name: "Transactions List",
        href: "/admin/reports/transactions-list",
        icon: FaRegListAlt,
        current: false,
      },
    ],
  },
  {
    name: "Payout",
    href: "#",
    id: 11,
    icon: FaRegMoneyBillAlt,
    current: false,
    submenu: [
      {
        name: "Withdraw Request Lists",
        href: "/admin/payouts/withdraw-request-lists",
        icon: FaRegListAlt,
        current: false,
      },
    ],
  },
  {
    name: "Blog Management",
    href: "#",
    id: 19,
    icon: FileCog,
    current: false,
    submenu: [
      {
        name: "Categories",
        href: "/admin/blogs/categories",
        icon: FileCog,
        current: false,
      },
      {
        name: "Tags",
        href: "/admin/blogs/tags",
        icon: Tag,
        current: false,
      },
      {
        name: "Blogs",
        href: "/admin/blogs",
        icon: FileCog,
        current: false,
      },
      {
        name: "Pending Comments",
        href: "/admin/blogs/pending-comments",
        icon: MessageCircleIcon,
        current: false,
      },
    ],
  },
  {
    name: "KYC Management",
    href: "#",
    id: 6,
    icon: FaRegIdCard,
    current: false,
    submenu: [
      {
        name: "KYC Lists",
        href: "/admin/kyc",
        icon: FaRegIdCard,
        current: false,
      },
      {
        name: "KYC Verify Lists",
        href: "/admin/kyc/verify",
        icon: FaRegIdCard,
        current: false,
      },
    ],
  },
  {
    name: "FAQ",
    href: "/admin/faq",
    icon: FaRegQuestionCircle,
    current: false,
    id: 7,
  },
  {
    name: "Coupon",
    href: "/admin/coupon",
    icon: Layers,
    current: false,
    id: 8,
  },
  {
    name: "Subscription Lists",
    href: "/admin/subscriptions",
    icon: UserCheck,
    current: false,
    id: 18,
  },
  {
    name: "Settings",
    href: "#",
    id: 10,
    icon: Settings,
    current: false,
    submenu: [
      {
        name: "Payout Settings",
        href: "/admin/settings/payout-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "Payment Credentials",
        href: "/admin/settings/payment-credentials",
        icon: Settings2,
        current: false,
      },
      {
        name: "Auth Credentials",
        href: "/admin/settings/auth-credentials",
        icon: Settings2,
        current: false,
      },
      {
        name: "Live Class Settings",
        href: "/admin/settings/live-class-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "SMTP Settings",
        href: "/admin/settings/smtp-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "Site Settings",
        href: "/admin/settings/site-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "Landing Page",
        href: "/admin/settings/landing-page",
        icon: Settings2,
        current: false,
      },
      {
        name: "Privacy Policy and Terms",
        href: "/admin/settings/privacy-policy-terms",
        icon: Settings2,
        current: false,
      },
    ],
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
export default function Sidebar({ sidebarOpen, setSidebarOpen }: any) {
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
      <MobileSidebar
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

      <DesktopSidebar
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
