"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  Dumbbell,
  Package,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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

// This is sample data.
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
  teams: [
    {
      name: "ZFit",
      logo: "/logo.png",
      plan: "Gym Management Portal",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "Members",
          url: "/dashboard/users/members",
        },
        {
          title: "Staff",
          url: "/dashboard/users/staff",
        },
        {
          title: "Managers",
          url: "/dashboard/users/managers",
        },
      ],
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: Calendar,
      items: [
        {
          title: "Today's Attendance",
          url: "/dashboard/attendance/today",
        },
        {
          title: "Attendance History",
          url: "/dashboard/attendance/history",
        },
        {
          title: "QR Code Scanner",
          url: "/dashboard/attendance/scan",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Membership Trends",
          url: "/dashboard/analytics/membership",
        },
        {
          title: "Revenue Reports",
          url: "/dashboard/analytics/revenue",
        },
        {
          title: "Attendance Stats",
          url: "/dashboard/analytics/attendance",
        },
      ],
    },
    {
      title: "Workouts",
      url: "/dashboard/workouts",
      icon: Dumbbell,
      items: [
        {
          title: "Workout Plans",
          url: "/dashboard/workouts/plans",
        },
        {
          title: "Exercise Library",
          url: "/dashboard/workouts/exercises",
        },
        {
          title: "Trainer Schedule",
          url: "/dashboard/workouts/schedule",
        },
      ],
    },
    {
      title: "Finance",
      icon: TrendingUp,
      items: [
        {
          title: "Management",
          url: "/dashboard/finance/overview",
        },
        {
          title: "Invoices",
          url: "/dashboard/finance/invoice",
        },
        {
          title: "Refunds",
          url: "/dashboard/finance/refund",
        },
      ],
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Package,
      items: [
        {
          title: "Categories",
          url: "/dashboard/inventory/categories",
        },
        {
          title: "Items",
          url: "/dashboard/inventory/items",
        },
        {
          title: "Stock Management",
          url: "/dashboard/inventory/stock",
        },
        {
          title: "Suppliers",
          url: "/dashboard/inventory/suppliers",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Morning Classes",
      url: "#",
      icon: Frame,
    },
    {
      name: "Evening Sessions",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Weekend Bootcamp",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const userData = {
    name: user?.name || "User",
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}