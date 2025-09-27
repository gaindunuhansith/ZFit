"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Calculator,
  User,
  CreditCard,
  Calendar,
  FileText,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Mock data - will be replaced with API calls
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
]

const mockPayments = [
  { id: "1", userId: "1", amount: 150, type: "membership", status: "completed", date: "2024-01-15" },
  { id: "2", userId: "2", amount: 75, type: "booking", status: "completed", date: "2024-01-20" },
  { id: "3", userId: "1", amount: 200, type: "inventory", status: "completed", date: "2024-01-25" },
]

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
  tax: number
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")
  const [status, setStatus] = useState("draft")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0, tax: 0 }
  ])
  const [discount, setDiscount] = useState(0)

  // Filter payments based on selected user
  const availablePayments = mockPayments.filter(payment =>
    !selectedUser || payment.userId === selectedUser
  )

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const totalTax = items.reduce((sum, item) => sum + item.tax, 0)
  const total = subtotal + totalTax - discount

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0, tax: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate total for the item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity
      const unitPrice = field === 'unitPrice' ? Number(value) : updatedItems[index].unitPrice
      updatedItems[index].total = quantity * unitPrice
    }

    setItems(updatedItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!selectedUser || !selectedPayment || items.some(item => !item.description || item.total <= 0)) {
      alert("Please fill in all required fields and ensure all items have valid amounts.")
      return
    }

    const invoiceData = {
      paymentId: selectedPayment,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        tax: item.tax
      })),
      subtotal,
      tax: totalTax,
      discount,
      total,
      dueDate: dueDate || null,
      status,
      generatedAt: new Date().toISOString(),
      notes
    }

    try {
      // Here you would make API call to create invoice
      console.log("Creating invoice:", invoiceData)

      // Mock success - in real app, this would be an API response
      alert("Invoice created successfully!")
      router.push("/dashboard/finance/invoice")
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert("Failed to create invoice. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
            <p className="text-muted-foreground">
              Generate a new invoice for your members.
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button onClick={handleSubmit}>
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer and Payment Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Customer & Payment Details
            </CardTitle>
            <CardDescription>
              Select the customer and related payment for this invoice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment">Related Payment *</Label>
                <Select
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                  disabled={!selectedUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePayments.map((payment) => (
                      <SelectItem key={payment.id} value={payment.id}>
                        {payment.type} - ${payment.amount} ({payment.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Invoice Items
              </div>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardTitle>
            <CardDescription>
              Add the items or services being invoiced.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-4">
                    <Label htmlFor={`description-${index}`}>Description *</Label>
                    <Input
                      id={`description-${index}`}
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`unitPrice-${index}`}>Unit Price</Label>
                    <Input
                      id={`unitPrice-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`tax-${index}`}>Tax</Label>
                    <Input
                      id={`tax-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.tax}
                      onChange={(e) => updateItem(index, 'tax', Number(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm font-medium">${item.total.toFixed(2)}</div>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes for the invoice..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
