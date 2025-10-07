"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Apple, Target, Plus, ArrowRight, Activity } from "lucide-react"
import Link from "next/link"
import { trackingApi, type Workout, type Nutrition, type Goal } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"

export function MemberTrackingWidget() {
  const { user } = useAuth()
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [recentNutrition, setRecentNutrition] = useState<Nutrition[]>([])
  const [recentGoals, setRecentGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?._id && user._id.length === 24) {
      fetchRecentData()
    }
  }, [user?._id])

  const fetchRecentData = async () => {
    try {
      setLoading(true)
      const [workoutsRes, nutritionRes, goalsRes] = await Promise.all([
        trackingApi.getWorkouts(user?._id),
        trackingApi.getNutrition(user?._id),
        trackingApi.getGoals(user?._id)
      ])

      if (workoutsRes.success && workoutsRes.data) {
        setRecentWorkouts(workoutsRes.data)
      }
      if (nutritionRes.success && nutritionRes.data) {
        setRecentNutrition(nutritionRes.data)
      }
      if (goalsRes.success && goalsRes.data) {
        setRecentGoals(goalsRes.data)
      }
    } catch (error) {
      console.error("Failed to fetch recent data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getQuickStats = () => {
    const today = new Date().toDateString()
    const todayWorkouts = recentWorkouts.filter(w => new Date(w.date).toDateString() === today).length
    const todayCalories = recentNutrition
      .filter(n => new Date(n.date).toDateString() === today)
      .reduce((sum, n) => sum + n.calories, 0)
    const activeGoals = recentGoals.filter(g => !g.deadline || new Date(g.deadline) > new Date()).length

    return {
      todayWorkouts,
      todayCalories,
      activeGoals,
    }
  }

  const stats = getQuickStats()

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tracking Overview</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tracking Overview</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.todayWorkouts}</div>
            <p className="text-xs text-muted-foreground">Workouts Today</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.todayCalories}</div>
            <p className="text-xs text-muted-foreground">Calories Today</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground">Active Goals</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Link href="/memberDashboard/tracking/workouts">
            <Button variant="outline" className="w-full">
              <Dumbbell className="mr-2 h-4 w-4" /> Log Workout
            </Button>
          </Link>
          <Link href="/memberDashboard/tracking/nutrition">
            <Button variant="outline" className="w-full">
              <Apple className="mr-2 h-4 w-4" /> Log Meal
            </Button>
          </Link>
          <Link href="/memberDashboard/tracking">
            <Button className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" /> View All Tracking
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
