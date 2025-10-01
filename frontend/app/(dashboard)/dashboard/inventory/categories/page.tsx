"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { categoryApiService } from '@/lib/api/categoryApi'
import type { CategoryData, Category } from '@/lib/api/categoryApi'
import { CategoryFormModal, CategoryFormData, UpdateCategoryFormData } from '@/components/CategoryFormModal'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryApiService.getCategories()
      setCategories(response.data as Category[])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await categoryApiService.deleteCategory(categoryId)
      setCategories(categories.filter(category => category._id !== categoryId))
      setError('') // Clear any previous errors on success
    } catch (error: any) {
      console.error('Error deleting category:', error)
      
      // Try to extract the error message from the API response
      let errorMessage = 'Failed to delete category'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    }
  }

  const handleModalSubmit = async (formData: CategoryFormData | UpdateCategoryFormData) => {
    try {
      if (editingCategory) {
        // Update existing category
        await categoryApiService.updateCategory(editingCategory._id, formData)
      } else {
        // Create new category
        await categoryApiService.createCategory(formData as CategoryData)
      }
      fetchCategories() // Refresh the list
    } catch (error) {
      console.error('Error saving category:', error)
      setError('Failed to save category')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">Manage inventory categories</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading categories...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage inventory categories</p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Categories
          </CardTitle>
          <CardDescription>
            View and manage all inventory categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || 'No description'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No categories found</p>
              <p className="text-sm">Add your first category to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingCategory ? {
          name: editingCategory.name,
          description: editingCategory.description,
        } : undefined}
        mode={editingCategory ? 'edit' : 'add'}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      />
    </div>
  )
}