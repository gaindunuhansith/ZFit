"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { trackingApi, type Workout, type WorkoutData } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"
import { Dumbbell, Plus, Edit, Trash2, Search } from "lucide-react"

export default function MemberWorkoutsPage() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [formData, setFormData] = useState<WorkoutData>({
    memberId: user?._id || "",
    exercise: "",
    sets: 1,
    reps: 1,
    weight: 0,
    notes: "",
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (user?._id) {
      setFormData(prev => ({ ...prev, memberId: user._id }))
      fetchWorkouts()
    }
  }, [user?._id])

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      const response = await trackingApi.getWorkouts(user?._id)
      if (response.success && response.data) {
        setWorkouts(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch workouts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ensure memberId is set
    if (!formData.memberId) {
      console.error("Member ID is missing")
      return
    }
    
    console.log("Submitting workout data:", formData)
    
    try {
      if (editingWorkout) {
        await trackingApi.updateWorkout(editingWorkout._id, formData)
        console.log("Workout updated successfully")
      } else {
        await trackingApi.createWorkout(formData)
        console.log("Workout added successfully")
      }
      setIsDialogOpen(false)
      setEditingWorkout(null)
      resetForm()
      fetchWorkouts()
    } catch (error) {
      console.error("Failed to save workout:", error)
      alert("Failed to save workout. Please try again.")
    }
  }

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout)
    setFormData({
      memberId: workout.memberId,
      exercise: workout.exercise,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      notes: workout.notes || "",
      date: new Date(workout.date).toISOString().split('T')[0]
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      try {
        await trackingApi.deleteWorkout(id)
        console.log("Workout deleted successfully")
        fetchWorkouts()
      } catch (error) {
        console.error("Failed to delete workout:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      memberId: user?._id || "",
      exercise: "",
      sets: 1,
      reps: 1,
      weight: 0,
      notes: "",
      date: new Date().toISOString().split('T')[0]
    })
    setEditingWorkout(null)
  }

  const filteredWorkouts = workouts.filter(workout =>
    workout.exercise.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading workouts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Workouts</h1>
          <p className="text-muted-foreground">
            Track your exercise sessions and monitor your progress
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingWorkout ? "Edit Workout" : "Add New Workout"}
              </DialogTitle>
              <DialogDescription>
                {editingWorkout ? "Update your workout details" : "Add a new workout to your log"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exercise">Exercise</Label>
                <Input
                  id="exercise"
                  value={formData.exercise}
                  onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                  placeholder="e.g., Bench Press, Squats"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this workout..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWorkout ? "Update Workout" : "Add Workout"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Workouts List */}
      <div className="grid gap-4">
        {filteredWorkouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workouts found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start tracking your workouts to see them here"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredWorkouts.map((workout) => (
            <Card key={workout._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{workout.exercise}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {new Date(workout.date).toLocaleDateString()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(workout)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(workout._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{workout.sets}</p>
                    <p className="text-sm text-muted-foreground">Sets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{workout.reps}</p>
                    <p className="text-sm text-muted-foreground">Reps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{workout.weight}kg</p>
                    <p className="text-sm text-muted-foreground">Weight</p>
                  </div>
                </div>
                {workout.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{workout.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
