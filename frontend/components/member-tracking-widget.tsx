"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { trackingApi, type Workout, type Nutrition, type Goal } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"
import { Activity, Target, Apple, Dumbbell, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

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
        setRecentWorkouts(workoutsRes.data.slice(-3))
      }
      if (nutritionRes.success && nutritionRes.data) {
        setRecentNutrition(nutritionRes.data.slice(-3))
      }
      if (goalsRes.success && goalsRes.data) {
        setRecentGoals(goalsRes.data.slice(-3))
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
      activeGoals
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Fitness Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading tracking data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = getQuickStats()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Fitness Tracking
        </CardTitle>
        <CardDescription>
          Your fitness progress at a glance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.todayWorkouts}</div>
            <p className="text-xs text-muted-foreground">Today's Workouts</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.todayCalories}</div>
            <p className="text-xs text-muted-foreground">Today's Calories</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground">Active Goals</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/memberDashboard/tracking/workouts">
            <Button variant="outline" size="sm" className="w-full">
              <Dumbbell className="h-4 w-4 mr-2" />
              Log Workout
            </Button>
          </Link>
          <Link href="/memberDashboard/tracking/nutrition">
            <Button variant="outline" size="sm" className="w-full">
              <Apple className="h-4 w-4 mr-2" />
              Log Meal
            </Button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Activity</h4>
          
          {recentWorkouts.length === 0 && recentNutrition.length === 0 && recentGoals.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <Link href="/memberDashboard/tracking">
                <Button variant="outline" size="sm" className="mt-2">
                  Start Tracking
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentWorkouts.slice(0, 2).map((workout) => (
                <div key={workout._id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="h-4 w-4 text-blue-500" />
                    <span>{workout.exercise}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {new Date(workout.date).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
              
              {recentNutrition.slice(0, 2).map((meal) => (
                <div key={meal._id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Apple className="h-4 w-4 text-green-500" />
                    <span className="capitalize">{meal.mealType} - {meal.calories} cal</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {new Date(meal.date).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
              
              {recentGoals.slice(0, 1).map((goal) => (
                <div key={goal._id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="capitalize">{goal.goalType.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="pt-2 border-t">
          <Link href="/memberDashboard/tracking">
            <Button variant="ghost" size="sm" className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              View Full Tracking Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
