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
import { trackingApi, type Nutrition, type NutritionData } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"
import { Apple, Plus, Edit, Trash2, Search } from "lucide-react"

export default function MemberNutritionPage() {
  const { user } = useAuth()
  const [nutrition, setNutrition] = useState<Nutrition[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNutrition, setEditingNutrition] = useState<Nutrition | null>(null)
  const [formData, setFormData] = useState<NutritionData>({
    memberId: user?._id || "",
    mealType: "breakfast",
    calories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fats: 0
    },
    notes: "",
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (user?._id) {
      fetchNutrition()
    }
  }, [user?._id])

  const fetchNutrition = async () => {
    try {
      setLoading(true)
      const response = await trackingApi.getNutrition(user?._id)
      if (response.success && response.data) {
        setNutrition(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch nutrition:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingNutrition) {
        await trackingApi.updateNutrition(editingNutrition._id, formData)
        console.log("Nutrition entry updated successfully")
      } else {
        await trackingApi.createNutrition(formData)
        console.log("Nutrition entry added successfully")
      }
      setIsDialogOpen(false)
      setEditingNutrition(null)
      resetForm()
      fetchNutrition()
    } catch (error) {
      console.error("Failed to save nutrition:", error)
    }
  }

  const handleEdit = (nutrition: Nutrition) => {
    setEditingNutrition(nutrition)
    setFormData({
      memberId: nutrition.memberId,
      mealType: nutrition.mealType,
      calories: nutrition.calories,
      macros: nutrition.macros || { protein: 0, carbs: 0, fats: 0 },
      notes: nutrition.notes || "",
      date: new Date(nutrition.date).toISOString().split('T')[0]
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this nutrition entry?")) {
      try {
        await trackingApi.deleteNutrition(id)
        console.log("Nutrition entry deleted successfully")
        fetchNutrition()
      } catch (error) {
        console.error("Failed to delete nutrition:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      memberId: user?._id || "",
      mealType: "breakfast",
      calories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fats: 0
      },
      notes: "",
      date: new Date().toISOString().split('T')[0]
    })
    setEditingNutrition(null)
  }

  const filteredNutrition = nutrition.filter(entry =>
    entry.mealType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading nutrition data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Nutrition</h1>
          <p className="text-muted-foreground">
            Track your meals, calories, and macronutrients
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingNutrition ? "Edit Meal" : "Add New Meal"}
              </DialogTitle>
              <DialogDescription>
                {editingNutrition ? "Update your meal details" : "Add a new meal to your nutrition log"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mealType">Meal Type</Label>
                <Select value={formData.mealType} onValueChange={(value) => setFormData({ ...formData, mealType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.macros?.protein || 0}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      macros: { 
                        ...formData.macros, 
                        protein: parseFloat(e.target.value) || 0 
                      } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.macros?.carbs || 0}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      macros: { 
                        ...formData.macros, 
                        carbs: parseFloat(e.target.value) || 0 
                      } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.macros?.fats || 0}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      macros: { 
                        ...formData.macros, 
                        fats: parseFloat(e.target.value) || 0 
                      } 
                    })}
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
                  placeholder="Any additional notes about this meal..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingNutrition ? "Update Meal" : "Add Meal"}
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
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Nutrition List */}
      <div className="grid gap-4">
        {filteredNutrition.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Apple className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No meals found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start tracking your nutrition to see meals here"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Meal
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredNutrition.map((meal) => (
            <Card key={meal._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{meal.mealType}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {new Date(meal.date).toLocaleDateString()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(meal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(meal._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{meal.calories}</p>
                    <p className="text-sm text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{meal.macros?.protein || 0}g</p>
                    <p className="text-sm text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{meal.macros?.carbs || 0}g</p>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{meal.macros?.fats || 0}g</p>
                    <p className="text-sm text-muted-foreground">Fats</p>
                  </div>
                </div>
                {meal.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{meal.notes}</p>
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
