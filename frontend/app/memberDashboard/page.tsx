"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  CreditCard,
  Activity,
  Target,
  TrendingUp,
  Clock,
  Dumbbell,
  Users,
  Award,
  Flame,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function MemberDashboardPage() {
  const { user } = useAuth()

  // Mock data for member dashboard
  const memberStats = {
    totalWorkouts: 24,
    thisMonthWorkouts: 8,
    streakDays: 5,
    membershipDaysLeft: 23,
    nextClass: {
      name: "HIIT Training",
      time: "Today, 6:00 PM",
      instructor: "Sarah Johnson"
    },
    recentAchievements: [
      { title: "5-Day Streak", description: "Completed workouts for 5 consecutive days", icon: Flame },
      { title: "Strength Master", description: "Completed 10 strength training sessions", icon: Dumbbell },
    ],
    upcomingClasses: [
      { name: "Yoga Flow", date: "Tomorrow", time: "9:00 AM", instructor: "Mike Chen" },
      { name: "CrossFit", date: "Wed", time: "7:00 PM", instructor: "Lisa Wong" },
      { name: "Pilates", date: "Fri", time: "10:00 AM", instructor: "Anna Smith" },
    ]
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Member'}!
          </h2>
          <p className="text-muted-foreground">
            Here's your fitness journey overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Flame className="w-4 h-4 mr-1" />
            {memberStats.streakDays} day streak
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              +{memberStats.thisMonthWorkouts} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.streakDays}</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.membershipDaysLeft}</div>
            <p className="text-xs text-muted-foreground">
              days remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{memberStats.nextClass.name}</div>
            <p className="text-xs text-muted-foreground">
              {memberStats.nextClass.time}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Next Class */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Next Class
            </CardTitle>
            <CardDescription>
              Your upcoming scheduled class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/avatars/instructor.jpg" alt={memberStats.nextClass.instructor} />
                <AvatarFallback>
                  {memberStats.nextClass.instructor.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{memberStats.nextClass.name}</h3>
                <p className="text-sm text-muted-foreground">
                  with {memberStats.nextClass.instructor}
                </p>
                <p className="text-sm font-medium text-primary">
                  {memberStats.nextClass.time}
                </p>
              </div>
              <Button>Join Class</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Your latest milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {memberStats.recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <achievement.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Classes
            </CardTitle>
            <CardDescription>
              Classes you've booked for this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberStats.upcomingClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{classItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {classItem.date} • {classItem.time} • {classItem.instructor}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Book More Classes
            </Button>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Progress
            </CardTitle>
            <CardDescription>
              Your fitness goals for this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Workout Frequency</span>
                <span>8/12 sessions</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Strength Goals</span>
                <span>3/5 completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nutrition Tracking</span>
                <span>15/20 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <Button className="w-full mt-4">
              View Detailed Progress
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Book Class
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Activity className="h-6 w-6" />
              Log Workout
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Target className="h-6 w-6" />
              Set Goals
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}