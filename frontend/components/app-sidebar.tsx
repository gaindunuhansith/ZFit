"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
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
      name: "ZFit Admin",
      logo: GalleryVerticalEnd,
      plan: "Fitness Management",
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
      title: "Members",
      url: "/dashboard/members",
      icon: Users,
      items: [
        {
          title: "All Members",
          url: "/dashboard/members",
        },
        {
          title: "Active Members",
          url: "/dashboard/members/active",
        },
        {
          title: "Inactive Members",
          url: "/dashboard/members/inactive",
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
      url: "/dashboard/finance",
      icon: TrendingUp,
      items: [
        {
          title: "Payment Dashboard",
          url: "/dashboard/finance/payment",
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
    avatar: "/avatars/default.jpg",
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