"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { trackingApi, type Workout, type Nutrition, type Goal, type Progress } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"
import { TrendingUp, Dumbbell, Apple, Target, Calendar, BarChart3 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

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

  // Process data for charts
  const getWorkoutChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        workouts: 0,
        totalWeight: 0
      }
    })

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date).toISOString().split('T')[0]
      const dayData = last30Days.find(day => day.date === workoutDate)
      if (dayData) {
        dayData.workouts += 1
        dayData.totalWeight += workout.weight * workout.sets * workout.reps
      }
    })

    return last30Days.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      workouts: day.workouts,
      totalWeight: day.totalWeight
    }))
  }

  const getNutritionChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      }
    })

    nutrition.forEach(meal => {
      const mealDate = new Date(meal.date).toISOString().split('T')[0]
      const dayData = last7Days.find(day => day.date === mealDate)
      if (dayData) {
        dayData.calories += meal.calories
        dayData.protein += meal.macros?.protein || 0
        dayData.carbs += meal.macros?.carbs || 0
        dayData.fats += meal.macros?.fats || 0
      }
    })

    return last7Days.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: day.calories,
      protein: day.protein,
      carbs: day.carbs,
      fats: day.fats
    }))
  }

  const getGoalStatusData = () => {
    const activeGoals = goals.filter(goal => !goal.deadline || new Date(goal.deadline) > new Date()).length
    const completedGoals = goals.filter(goal => goal.deadline && new Date(goal.deadline) <= new Date()).length
    const overdueGoals = goals.filter(goal => goal.deadline && new Date(goal.deadline) < new Date()).length

    return [
      { name: 'Active', value: activeGoals, color: '#3b82f6' },
      { name: 'Completed', value: completedGoals, color: '#10b981' },
      { name: 'Overdue', value: overdueGoals, color: '#ef4444' }
    ]
  }

  const getQuickStats = () => {
    const today = new Date().toDateString()
    const thisWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    })

    const todayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === today).length
    const weekWorkouts = workouts.filter(w => thisWeek.includes(new Date(w.date).toDateString())).length
    const todayCalories = nutrition.filter(n => new Date(n.date).toDateString() === today).reduce((sum, n) => sum + n.calories, 0)
    const weekCalories = nutrition.filter(n => thisWeek.includes(new Date(n.date).toDateString())).reduce((sum, n) => sum + n.calories, 0)
    const activeGoals = goals.filter(g => !g.deadline || new Date(g.deadline) > new Date()).length
    const completedGoals = goals.filter(g => g.deadline && new Date(g.deadline) <= new Date()).length

    return {
      todayWorkouts,
      weekWorkouts,
      todayCalories,
      weekCalories,
      activeGoals,
      completedGoals,
      totalWorkouts: workouts.length,
      totalMeals: nutrition.length
    }
  }

  const stats = getQuickStats()
  const workoutChartData = getWorkoutChartData()
  const nutritionChartData = getNutritionChartData()
  const goalStatusData = getGoalStatusData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading progress data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground">
          Track your fitness journey and monitor your progress over time
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.weekWorkouts} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Calories</CardTitle>
            <Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCalories}</div>
            <p className="text-xs text-muted-foreground">
              {stats.weekCalories} this week
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
              {stats.completedGoals} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts + stats.totalMeals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalWorkouts} workouts, {stats.totalMeals} meals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Workout Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Workout Progress (Last 30 Days)
            </CardTitle>
            <CardDescription>
              Daily workout frequency and total weight lifted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="workouts" fill="#3b82f6" name="Workouts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Nutrition Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Apple className="h-5 w-5 mr-2" />
              Nutrition Intake (Last 7 Days)
            </CardTitle>
            <CardDescription>
              Daily calorie and macronutrient consumption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nutritionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2} name="Calories" />
                <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={2} name="Protein (g)" />
                <Line type="monotone" dataKey="carbs" stroke="#10b981" strokeWidth={2} name="Carbs (g)" />
                <Line type="monotone" dataKey="fats" stroke="#8b5cf6" strokeWidth={2} name="Fats (g)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goals Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Goals Status Overview
          </CardTitle>
          <CardDescription>
            Distribution of your fitness goals by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {goalStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.value} goals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2" />
              Recent Workouts
            </CardTitle>
            <CardDescription>Your latest workout sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.slice(-5).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent workouts</p>
            ) : (
              <div className="space-y-3">
                {workouts.slice(-5).map((workout) => (
                  <div key={workout._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{workout.exercise}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(workout.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Apple className="h-5 w-5 mr-2" />
              Recent Meals
            </CardTitle>
            <CardDescription>Your latest nutrition entries</CardDescription>
          </CardHeader>
          <CardContent>
            {nutrition.slice(-5).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent meals</p>
            ) : (
              <div className="space-y-3">
                {nutrition.slice(-5).map((meal) => (
                  <div key={meal._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{meal.mealType}</p>
                      <p className="text-sm text-muted-foreground">
                        {meal.calories} calories
                        {meal.macros && (
                          <span className="ml-2">
                            • P: {meal.macros.protein || 0}g • C: {meal.macros.carbs || 0}g • F: {meal.macros.fats || 0}g
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(meal.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
