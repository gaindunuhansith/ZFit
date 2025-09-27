"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Calendar, CreditCard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function MemberProfilePage() {
  const { user } = useAuth()

  // Mock profile data
  const profileData = {
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: "+94 77 123 4567",
    joinDate: "2024-01-15",
    membership: {
      plan: "Premium Monthly",
      expiryDate: "2025-10-15",
      status: "active"
    },
    stats: {
      totalWorkouts: 24,
      attendanceRate: 85,
      currentStreak: 5
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
          <p className="text-muted-foreground">
            Manage your account information and view your membership details.
          </p>
        </div>
        <Button>Edit Profile</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatars/user.jpg" alt={profileData.name} />
                <AvatarFallback>
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">{profileData.name}</h3>
                <Badge variant="secondary">Member</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(profileData.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{profileData.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{profileData.membership.plan}</h3>
              <Badge variant="default">{profileData.membership.status}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expires on:</span>
                <span className="font-medium">
                  {new Date(profileData.membership.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              Renew Membership
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Fitness Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Fitness Statistics</CardTitle>
          <CardDescription>
            Your fitness journey progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData.stats.totalWorkouts}</div>
              <p className="text-sm text-muted-foreground">Total Workouts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData.stats.attendanceRate}%</div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData.stats.currentStreak}</div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}