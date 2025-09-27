"use client"

import * as React from "react"
import {
  User,
  Calendar,
  CreditCard,
  Activity,
  Dumbbell,
  Target,
  BarChart3,
  Home,
  Users,
  ShoppingBag,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Member-specific navigation data
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
  teams: [
    {
      name: "ZFit Member",
      logo: "/logo.png",
      plan: "Member Portal",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/memberDashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Profile",
      url: "/memberDashboard/profile",
      icon: User,
    },
    {
      title: "Memberships",
      url: "/memberDashboard/memberships",
      icon: Users,
      items: [
        {
          title: "My Memberships",
          url: "/memberDashboard/memberships/my-memberships",
        },
        {
          title: "Browse Memberships",
          url: "/memberDashboard/memberships/browse",
        },
      ],
      title: "Store",
      url: "/memberDashboard/store",
      icon: ShoppingBag,
    },
    {
      title: "My Classes",
      url: "/memberDashboard/classes",
      icon: Dumbbell,
      items: [
        {
          title: "Booked Classes",
          url: "/memberDashboard/classes/booked",
        },
        {
          title: "Available Classes",
          url: "/memberDashboard/classes/available",
        },
        {
          title: "Class Schedule",
          url: "/memberDashboard/classes/schedule",
        },
      ],
    },
    {
      title: "Bookings",
      url: "/memberDashboard/bookings",
      icon: Calendar,
      items: [
        {
          title: "My Bookings",
          url: "/memberDashboard/bookings/my-bookings",
        },
        {
          title: "Book New Session",
          url: "/memberDashboard/bookings/new",
        },
        {
          title: "Booking History",
          url: "/memberDashboard/bookings/history",
        },
      ],
    },
    {
      title: "Payments",
      url: "/memberDashboard/payments",
      icon: CreditCard,
      items: [
        {
          title: "Payment History",
          url: "/memberDashboard/payments/history",
        },
        {
          title: "Membership Status",
          url: "/memberDashboard/payments/membership",
        },
        {
          title: "Invoices",
          url: "/memberDashboard/payments/invoices",
        },
      ],
    },
    {
      title: "Fitness Tracking",
      url: "/memberDashboard/tracking",
      icon: Activity,
      items: [
        {
          title: "Workout Log",
          url: "/memberDashboard/tracking/workouts",
        },
        {
          title: "Progress",
          url: "/memberDashboard/tracking/progress",
        },
        {
          title: "Goals",
          url: "/memberDashboard/tracking/goals",
        },
        {
          title: "Achievements",
          url: "/memberDashboard/tracking/achievements",
        },
      ],
    },
    {
      title: "Nutrition",
      url: "/memberDashboard/nutrition",
      icon: Target,
      items: [
        {
          title: "Meal Plans",
          url: "/memberDashboard/nutrition/plans",
        },
        {
          title: "Food Diary",
          url: "/memberDashboard/nutrition/diary",
        },
        {
          title: "Nutrition Goals",
          url: "/memberDashboard/nutrition/goals",
        },
      ],
    },
    {
      title: "Reports",
      url: "/memberDashboard/reports",
      icon: BarChart3,
      items: [
        {
          title: "Monthly Progress",
          url: "/memberDashboard/reports/monthly",
        },
        {
          title: "Attendance Report",
          url: "/memberDashboard/reports/attendance",
        },
        {
          title: "Performance Stats",
          url: "/memberDashboard/reports/stats",
        },
      ],
    },
  ],
}

export function MemberSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const userData = {
    name: user?.name || "Member",
    email: user?.email || "",
    avatar: "/avatars/default.svg",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}