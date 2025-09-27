"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { ZodError } from 'zod'

// Category form validation schemas - SAME PATTERN AS UserFormModal
const createCategoryFormSchema = z.object({
  categoryName: z.string()
    .min(2, "Category name must be at least 2 characters long")
    .max(50, "Category name must be at most 50 characters long"),
  categoryDescription: z.string()
    .min(5, "Category description must be at least 5 characters long")
    .max(200, "Category description must be at most 200 characters long"),
})

const updateCategoryFormSchema = z.object({
  categoryName: z.string()
    .min(2, "Category name must be at least 2 characters long")
    .max(50, "Category name must be at most 50 characters long")
    .optional(),
  categoryDescription: z.string()
    .min(5, "Category description must be at least 5 characters long")
    .max(200, "Category description must be at most 200 characters long")
    .optional(),
})

type CategoryFormData = z.infer<typeof createCategoryFormSchema>
type UpdateCategoryFormData = z.infer<typeof updateCategoryFormSchema>

export type { CategoryFormData, UpdateCategoryFormData }

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData | UpdateCategoryFormData) => Promise<void>
  initialData?: Partial<CategoryFormData>
  mode: 'add' | 'edit'
  title: string
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  title,
}: CategoryFormModalProps) {
  type FormDataType = CategoryFormData | UpdateCategoryFormData

  const [formData, setFormData] = useState<FormDataType>({
    categoryName: '',
    categoryDescription: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        categoryName: initialData.categoryName || '',
        categoryDescription: initialData.categoryDescription || '',
      })
    } else {
      setFormData({
        categoryName: '',
        categoryDescription: '',
      })
    }
    setErrors({})
  }, [initialData, mode, isOpen])

  const validateForm = () => {
    try {
      const schema = mode === 'add' ? createCategoryFormSchema : updateCategoryFormSchema
      schema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const path = issue.path.join('.')
          zodErrors[path] = issue.message
        })
        setErrors(zodErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // For updates, only send fields that have values - SAME LOGIC AS UserFormModal
      let dataToSend = formData

      if (mode === 'edit') {
        // Filter out empty/undefined values for updates
        const filteredData: Record<string, string> = {}
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            filteredData[key] = value
          }
        })
        dataToSend = filteredData as CategoryFormData
      }

      await onSubmit(dataToSend)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Create a new inventory category. Fill in all required fields.' 
              : 'Update the category information. Only fill in the fields you want to change.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Category Name - SAME PATTERN AS UserFormModal */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Name *
              </Label>
              <div className="col-span-3">
                <Input
                  id="categoryName"
                  value={(formData as CategoryFormData).categoryName || ''}
                  onChange={(e) => handleInputChange('categoryName', e.target.value)}
                  placeholder="Enter category name"
                  className={errors.categoryName ? 'border-red-500' : ''}
                />
                {errors.categoryName && (
                  <p className="text-sm text-red-500 mt-1">{errors.categoryName}</p>
                )}
              </div>
            </div>

            {/* Category Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="categoryDescription" className="text-right mt-2">
                Description *
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="categoryDescription"
                  value={(formData as CategoryFormData).categoryDescription || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleInputChange('categoryDescription', e.target.value)
                  }
                  placeholder="Enter category description"
                  className={errors.categoryDescription ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.categoryDescription && (
                  <p className="text-sm text-red-500 mt-1">{errors.categoryDescription}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'add' ? 'Create Category' : 'Update Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}