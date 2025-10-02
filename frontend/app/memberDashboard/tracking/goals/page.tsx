"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { trackingApi, type Goal, type GoalData } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"
import { Target, Plus, Edit, Trash2, Search, Calendar, CheckCircle } from "lucide-react"

export default function MemberGoalsPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState<Omit<GoalData, 'deadline'> & { deadline?: string }>({
    memberId: user?._id || "",
    goalType: "weight_loss",
    target: "",
    deadline: "",
    assignedBy: user?._id || ""
  })

  useEffect(() => {
    if (user?._id) {
      fetchGoals()
    }
  }, [user?._id])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await trackingApi.getGoals(user?._id)
      if (response.success && response.data) {
        setGoals(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const goalData: GoalData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined
      }
      
      if (editingGoal) {
        await trackingApi.updateGoal(editingGoal._id, goalData)
        console.log("Goal updated successfully")
      } else {
        await trackingApi.createGoal(goalData)
        console.log("Goal created successfully")
      }
      setIsDialogOpen(false)
      setEditingGoal(null)
      resetForm()
      fetchGoals()
    } catch (error) {
      console.error("Failed to save goal:", error)
    }
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      memberId: goal.memberId,
      goalType: goal.goalType,
      target: goal.target,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : "",
      assignedBy: goal.assignedBy || user?._id || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await trackingApi.deleteGoal(id)
        console.log("Goal deleted successfully")
        fetchGoals()
      } catch (error) {
        console.error("Failed to delete goal:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      memberId: user?._id || "",
      goalType: "weight_loss",
      target: "",
      deadline: "",
      assignedBy: user?._id || ""
    })
    setEditingGoal(null)
  }

  const filteredGoals = goals.filter(goal =>
    goal.goalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.target.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGoalStatus = (goal: Goal) => {
    if (!goal.deadline) return { status: "active", label: "Active", variant: "secondary" as const }
    
    const now = new Date()
    const deadline = new Date(goal.deadline)
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDeadline < 0) {
      return { status: "overdue", label: "Overdue", variant: "destructive" as const }
    } else if (daysUntilDeadline <= 7) {
      return { status: "urgent", label: "Due Soon", variant: "secondary" as const, className: "bg-orange-100 text-orange-800" }
    } else {
      return { status: "active", label: "Active", variant: "secondary" as const }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading goals...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Goals</h1>
          <p className="text-muted-foreground">
            Set and track your fitness goals
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Set New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? "Edit Goal" : "Set New Goal"}
              </DialogTitle>
              <DialogDescription>
                {editingGoal ? "Update your goal details" : "Set a new fitness goal to work towards"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select value={formData.goalType} onValueChange={(value) => setFormData({ ...formData, goalType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="weight_gain">Weight Gain</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Textarea
                  id="target"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="Describe your goal target (e.g., Lose 10kg, Bench press 100kg, Run 5km in under 25 minutes)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? "Update Goal" : "Set Goal"}
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
          placeholder="Search goals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Goals List */}
      <div className="grid gap-4">
        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Set your first fitness goal to get started"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Set Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => {
            const status = getGoalStatus(goal)
            return (
              <Card key={goal._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg capitalize">
                      {goal.goalType.replace('_', ' ')}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={status.variant}
                        className={status.className}
                      >
                        {status.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Target:</h4>
                      <p className="text-muted-foreground">{goal.target}</p>
                    </div>
                    
                    {goal.deadline && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">In Progress</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
