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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import { ZodError } from 'zod'

// Item form validation schemas - SAME PATTERN AS CategoryFormModal and SupplierFormModal
const createItemFormSchema = z.object({
  itemName: z.string()
    .min(2, "Item name must be at least 2 characters long")
    .max(100, "Item name must be at most 100 characters long"),
  itemDescription: z.string()
    .min(5, "Item description must be at least 5 characters long")
    .max(200, "Item description must be at most 200 characters long"),
  categoryID: z.string()
    .min(1, "Category is required")
    .max(50, "Category must be at most 50 characters long"),
  quantity: z.number()
    .min(0, "Quantity must be 0 or greater"),
  price: z.number()
    .min(0, "Price must be 0 or greater")
    .optional(),
  supplierID: z.string()
    .min(1, "Please select a supplier"),
  lowStockThreshold: z.number()
    .min(0, "Low stock threshold must be 0 or greater"),
  maintenanceStatus: z.enum(["good", "maintenance_required", "under_repair"]),
  lastMaintenanceDate: z.string().optional(),
})

const updateItemFormSchema = z.object({
  itemName: z.string()
    .min(2, "Item name must be at least 2 characters long")
    .max(100, "Item name must be at most 100 characters long")
    .optional(),
  itemDescription: z.string()
    .min(5, "Item description must be at least 5 characters long")
    .max(200, "Item description must be at most 200 characters long")
    .optional(),
  categoryID: z.string()
    .min(1, "Category is required")
    .max(50, "Category must be at most 50 characters long")
    .optional(),
  quantity: z.number()
    .min(0, "Quantity must be 0 or greater")
    .optional(),
  price: z.number()
    .min(0, "Price must be 0 or greater")
    .optional(),
  supplierID: z.string()
    .min(1, "Please select a supplier")
    .optional(),
  lowStockThreshold: z.number()
    .min(0, "Low stock threshold must be 0 or greater")
    .optional(),
  maintenanceStatus: z.enum(["good", "maintenance_required", "under_repair"]).optional(),
  lastMaintenanceDate: z.string().optional(),
})

type ItemFormData = z.infer<typeof createItemFormSchema>
type UpdateItemFormData = z.infer<typeof updateItemFormSchema>

export type { ItemFormData, UpdateItemFormData }

interface ItemFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ItemFormData | UpdateItemFormData) => Promise<void>
  initialData?: Partial<ItemFormData>
  mode: 'add' | 'edit'
  title: string
  suppliers: Array<{ _id: string; supplierName: string }>
}

export function ItemFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  title,
  suppliers,
}: ItemFormModalProps) {
  type FormDataType = ItemFormData | UpdateItemFormData

  const [formData, setFormData] = useState<FormDataType>({
    itemName: '',
    itemDescription: '',
    categoryID: undefined,
    quantity: 0,
    price: 0,
    supplierID: '',
    lowStockThreshold: 5,
    maintenanceStatus: 'good',
    lastMaintenanceDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        itemName: initialData.itemName || '',
        itemDescription: initialData.itemDescription || '',
        categoryID: initialData.categoryID,
        quantity: initialData.quantity || 0,
        price: initialData.price || 0,
        supplierID: initialData.supplierID || '',
        lowStockThreshold: initialData.lowStockThreshold || 5,
        maintenanceStatus: initialData.maintenanceStatus || 'good',
        lastMaintenanceDate: initialData.lastMaintenanceDate || '',
      })
    } else {
      setFormData({
        itemName: '',
        itemDescription: '',
        categoryID: undefined,
        quantity: 0,
        price: 0,
        supplierID: '',
        lowStockThreshold: 5,
        maintenanceStatus: 'good',
        lastMaintenanceDate: '',
      })
    }
    setErrors({})
  }, [initialData, mode, isOpen])

  const validateForm = () => {
    try {
      const schema = mode === 'add' ? createItemFormSchema : updateItemFormSchema
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
      // For updates, only send fields that have values - SAME LOGIC AS CategoryFormModal
      let dataToSend = formData

      if (mode === 'edit') {
        // Filter out empty/undefined values for updates
        const filteredData: Record<string, any> = {}
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            filteredData[key] = value
          }
        })
        dataToSend = filteredData as ItemFormData
      }

      await onSubmit(dataToSend)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ItemFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Create a new inventory item. Fill in all required fields.' 
              : 'Update the item information. Only fill in the fields you want to change.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Item Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">
                Name *
              </Label>
              <div className="col-span-3">
                <Input
                  id="itemName"
                  value={(formData as ItemFormData).itemName || ''}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  placeholder="Enter item name"
                  className={errors.itemName ? 'border-red-500' : ''}
                />
                {errors.itemName && (
                  <p className="text-sm text-red-500 mt-1">{errors.itemName}</p>
                )}
              </div>
            </div>

            {/* Item Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="itemDescription" className="text-right mt-2">
                Description *
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="itemDescription"
                  value={(formData as ItemFormData).itemDescription || ''}
                  onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                  placeholder="Enter item description"
                  className={errors.itemDescription ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.itemDescription && (
                  <p className="text-sm text-red-500 mt-1">{errors.itemDescription}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryID" className="text-right">
                Category *
              </Label>
              <div className="col-span-3">
                <Input
                  id="categoryID"
                  type="text"
                  placeholder="e.g. Supplements, Equipment, Nutrition, etc."
                  value={(formData as ItemFormData).categoryID || ''}
                  onChange={(e) => handleInputChange('categoryID', e.target.value)}
                  className={errors.categoryID ? 'border-red-500' : ''}
                />
                {errors.categoryID && (
                  <p className="text-sm text-red-500 mt-1">{errors.categoryID}</p>
                )}
              </div>
            </div>

            {/* Supplier */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierID" className="text-right">
                Supplier *
              </Label>
              <div className="col-span-3">
                <Select
                  value={(formData as ItemFormData).supplierID || ''}
                  onValueChange={(value) => handleInputChange('supplierID', value)}
                >
                  <SelectTrigger className={errors.supplierID ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier.supplierName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.supplierID && (
                  <p className="text-sm text-red-500 mt-1">{errors.supplierID}</p>
                )}
              </div>
            </div>

            {/* Quantity and Price Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity *
                </Label>
                <div className="col-span-3">
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={(formData as ItemFormData).quantity || 0}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price (Optional)
                </Label>
                <div className="col-span-3">
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={(formData as ItemFormData).price || 0}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Low Stock Threshold */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lowStockThreshold" className="text-right">
                Low Stock Alert
              </Label>
              <div className="col-span-3">
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="0"
                  value={(formData as ItemFormData).lowStockThreshold || 5}
                  onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 5)}
                  placeholder="5"
                  className={errors.lowStockThreshold ? 'border-red-500' : ''}
                />
                {errors.lowStockThreshold && (
                  <p className="text-sm text-red-500 mt-1">{errors.lowStockThreshold}</p>
                )}
              </div>
            </div>

            {/* Maintenance Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenanceStatus" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={(formData as ItemFormData).maintenanceStatus || 'good'}
                  onValueChange={(value) => handleInputChange('maintenanceStatus', value)}
                >
                  <SelectTrigger className={errors.maintenanceStatus ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="maintenance_required">Maintenance Required</SelectItem>
                    <SelectItem value="under_repair">Under Repair</SelectItem>
                  </SelectContent>
                </Select>
                {errors.maintenanceStatus && (
                  <p className="text-sm text-red-500 mt-1">{errors.maintenanceStatus}</p>
                )}
              </div>
            </div>

            {/* Last Maintenance Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastMaintenanceDate" className="text-right">
                Last Maintenance
              </Label>
              <div className="col-span-3">
                <Input
                  id="lastMaintenanceDate"
                  type="date"
                  value={(formData as ItemFormData).lastMaintenanceDate || ''}
                  onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                  className={errors.lastMaintenanceDate ? 'border-red-500' : ''}
                />
                {errors.lastMaintenanceDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastMaintenanceDate}</p>
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
              {loading ? 'Saving...' : mode === 'add' ? 'Create Item' : 'Update Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}