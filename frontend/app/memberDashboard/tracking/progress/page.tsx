"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { trackingApi, type Workout, type Nutrition, type Goal, type Progress } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"
import { TrendingUp, Calendar, Target, Apple, Dumbbell, Award } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function MemberProgressPage() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [nutrition, setNutrition] = useState<Nutrition[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?._id) {
      fetchAllData()
    }
  }, [user?._id])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [workoutsRes, nutritionRes, goalsRes, progressRes] = await Promise.all([
        trackingApi.getWorkouts(user?._id),
        trackingApi.getNutrition(user?._id),
        trackingApi.getGoals(user?._id),
        trackingApi.getProgress(user?._id)
      ])

      if (workoutsRes.success && workoutsRes.data) {
        setWorkouts(workoutsRes.data)
      }
      if (nutritionRes.success && nutritionRes.data) {
        setNutrition(nutritionRes.data)
      }
      if (goalsRes.success && goalsRes.data) {
        setGoals(goalsRes.data)
      }
      if (progressRes.success && progressRes.data) {
        setProgress(progressRes.data)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWorkoutTrends = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    return last30Days.map(date => {
      const dayWorkouts = workouts.filter(w => 
        new Date(w.date).toISOString().split('T')[0] === date
      )
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: dayWorkouts.length,
        totalWeight: dayWorkouts.reduce((sum, w) => sum + (w.weight * w.sets * w.reps), 0)
      }
    })
  }

  const getCalorieTrends = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    return last30Days.map(date => {
      const dayNutrition = nutrition.filter(n => 
        new Date(n.date).toISOString().split('T')[0] === date
      )
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calories: dayNutrition.reduce((sum, n) => sum + n.calories, 0)
      }
    })
  }

  const getExerciseDistribution = () => {
    const exerciseCount: Record<string, number> = {}
    workouts.forEach(workout => {
      exerciseCount[workout.exercise] = (exerciseCount[workout.exercise] || 0) + 1
    })
    
    return Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([exercise, count]) => ({ name: exercise, value: count }))
  }

  const getMacroDistribution = () => {
    const totalMacros = nutrition.reduce((acc, meal) => {
      if (meal.macros) {
        acc.protein += meal.macros.protein || 0
        acc.carbs += meal.macros.carbs || 0
        acc.fats += meal.macros.fats || 0
      }
      return acc
    }, { protein: 0, carbs: 0, fats: 0 })

    return [
      { name: 'Protein', value: totalMacros.protein, color: '#3b82f6' },
      { name: 'Carbs', value: totalMacros.carbs, color: '#10b981' },
      { name: 'Fats', value: totalMacros.fats, color: '#f59e0b' }
    ]
  }

  const getOverallStats = () => {
    const totalWorkouts = workouts.length
    const totalCalories = nutrition.reduce((sum, n) => sum + n.calories, 0)
    const activeGoals = goals.filter(g => !g.deadline || new Date(g.deadline) > new Date()).length
    const completedGoals = goals.filter(g => g.deadline && new Date(g.deadline) <= new Date()).length
    
    const last30DaysWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return workoutDate >= thirtyDaysAgo
    }).length

    return {
      totalWorkouts,
      totalCalories,
      activeGoals,
      completedGoals,
      last30DaysWorkouts,
      averageWorkoutsPerWeek: (last30DaysWorkouts / 4.3).toFixed(1)
    }
  }

  const workoutTrends = getWorkoutTrends()
  const calorieTrends = getCalorieTrends()
  const exerciseDistribution = getExerciseDistribution()
  const macroDistribution = getMacroDistribution()
  const stats = getOverallStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading progress data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
          <p className="text-muted-foreground">
            Track your fitness journey with detailed analytics
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.averageWorkoutsPerWeek} per week average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
            <Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              calories tracked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground">
              goals in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedGoals}</div>
            <p className="text-xs text-muted-foreground">
              goals achieved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workout Frequency (Last 30 Days)</CardTitle>
            <CardDescription>Number of workouts per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={workoutTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="workouts" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Calories (Last 30 Days)</CardTitle>
            <CardDescription>Calories consumed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calorieTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Exercises</CardTitle>
            <CardDescription>Most frequently performed exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={exerciseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {exerciseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Macronutrient Distribution</CardTitle>
            <CardDescription>Total macros consumed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent Activity Summary
          </CardTitle>
          <CardDescription>Your fitness activity over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.last30DaysWorkouts}</div>
              <p className="text-sm text-muted-foreground">Workouts completed</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {calorieTrends.reduce((sum, day) => sum + day.calories, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total calories</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(calorieTrends.reduce((sum, day) => sum + day.calories, 0) / 30)}
              </div>
              <p className="text-sm text-muted-foreground">Avg calories/day</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
