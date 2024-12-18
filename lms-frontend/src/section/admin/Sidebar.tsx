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
    name: "dashboard.dashboard",
    href: "/admin",
    id: 1,
    icon: MdOutlineDashboardCustomize,
    current: false,
  },
  {
    name: "dashboard.users",
    href: "#",
    id: 2,
    icon: Contact,
    current: true,
    submenu: [
      {
        name: "dashboard.admins",
        href: "/admin/lists",
        icon: UserCog,
        current: false,
      },
      {
        name: "dashboard.students",
        href: "/admin/students",
        icon: UserCog,
        current: false,
      },
      {
        name: "dashboard.instructors",
        href: "/admin/instructors",
        icon: UserCog,
        current: false,
      },
      {
        name: "dashboard.pendingInstructors",
        href: "/admin/instructors/pending",
        icon: UserCog,
        current: false,
      },
    ],
  },
  {
    name: "dashboard.categoryManagement",
    href: "#",
    id: 3,
    icon: TableProperties,
    current: false,
    submenu: [
      {
        name: "dashboard.categories",
        href: "/admin/categories",
        icon: TableProperties,
        current: false,
      },
      {
        name: "dashboard.subCategories",
        href: "/admin/sub-categories",
        icon: TableProperties,
        current: false,
      },
    ],
  },
  {
    name: "dashboard.courses",
    href: "#",
    id: 9,
    icon: FaRegFileAlt,
    current: false,
    submenu: [
      {
        name: "dashboard.allCourses",
        href: "/admin/courses",
        icon: FaRegListAlt,
        current: false,
      },
      {
        name: "dashboard.pendingCourses",
        href: "/admin/pending-courses",
        icon: FaRegListAlt,
        current: false,
      },
    ],
  },
  {
    name: "dashboard.instructorsWallets",
    href: "/admin/instructors-wallets",
    id: 12,
    icon: MdOutlineDashboardCustomize,
    current: false,
  },
  {
    name: "dashboard.reports",
    href: "#",
    id: 5,
    icon: Layers,
    current: false,
    submenu: [
      {
        name: "dashboard.courseEnrollment",
        href: "/admin/reports/course-enrollment",
        icon: FaRegListAlt,
        current: false,
      },
      {
        name: "dashboard.transactionsList",
        href: "/admin/reports/transactions-list",
        icon: FaRegListAlt,
        current: false,
      },
    ],
  },
  {
    name: "dashboard.payout",
    href: "#",
    id: 11,
    icon: FaRegMoneyBillAlt,
    current: false,
    submenu: [
      {
        name: "dashboard.withdrawRequestLists",
        href: "/admin/payouts/withdraw-request-lists",
        icon: FaRegListAlt,
        current: false,
      },
    ],
  },
  {
    name: "dashboard.blogManagement",
    href: "#",
    id: 19,
    icon: FileCog,
    current: false,
    submenu: [
      {
        name: "dashboard.blogCategories",
        href: "/admin/blogs/categories",
        icon: FileCog,
        current: false,
      },
      {
        name: "dashboard.tags",
        href: "/admin/blogs/tags",
        icon: Tag,
        current: false,
      },
      {
        name: "dashboard.blogs",
        href: "/admin/blogs",
        icon: FileCog,
        current: false,
      },
      {
        name: "dashboard.pendingComments",
        href: "/admin/blogs/pending-comments",
        icon: MessageCircleIcon,
        current: false,
      },
    ],
  },
  {
    name: "dashboard.kycManagement",
    href: "#",
    id: 6,
    icon: FaRegIdCard,
    current: false,
    submenu: [
      {
        name: "dashboard.kycLists",
        href: "/admin/kyc",
        icon: FaRegIdCard,
        current: false,
      },
      {
        name: "dashboard.kycVerifyLists",
        href: "/admin/kyc/verify",
        icon: FaRegIdCard,
        current: false,
      },
    ],
  },
  {
    name: "dashboard.faq",
    href: "/admin/faq",
    icon: FaRegQuestionCircle,
    current: false,
    id: 7,
  },
  {
    name: "dashboard.coupon",
    href: "/admin/coupon",
    icon: Layers,
    current: false,
    id: 8,
  },
  {
    name: "dashboard.subscriptionLists",
    href: "/admin/subscriptions",
    icon: UserCheck,
    current: false,
    id: 18,
  },
  {
    name: "dashboard.settings",
    href: "#",
    id: 10,
    icon: Settings,
    current: false,
    submenu: [
      {
        name: "dashboard.payoutSettings",
        href: "/admin/settings/payout-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "dashboard.paymentCredentials",
        href: "/admin/settings/payment-credentials",
        icon: Settings2,
        current: false,
      },
      {
        name: "dashboard.authCredentials",
        href: "/admin/settings/auth-credentials",
        icon: Settings2,
        current: false,
      },
      {
        name: "dashboard.liveClassSettings",
        href: "/admin/settings/live-class-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "dashboard.smtpSettings",
        href: "/admin/settings/smtp-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "dashboard.siteSettings",
        href: "/admin/settings/site-settings",
        icon: Settings2,
        current: false,
      },
      {
        name: "dashboard.landingPage",
        href: "/admin/settings/landing-page",
        icon: Settings2,
        current: false,
      },
      {
        name: "dashboard.terms",
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
