"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, CreditCard } from "lucide-react"
import Link from "next/link"

interface PaymentData {
  orderId: string
  paymentId?: string
  amount?: string
  currency?: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  useEffect(() => {
    // Extract payment data from URL parameters (PayHere returns these)
    const orderId = searchParams.get('order_id')
    const paymentId = searchParams.get('payment_id')
    const amount = searchParams.get('payhere_amount')
    const currency = searchParams.get('payhere_currency')
    
    if (orderId) {
      setPaymentData({
        orderId,
        paymentId: paymentId || undefined,
        amount: amount || undefined,
        currency: currency || undefined
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your membership has been purchased successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentData && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span className="text-sm text-gray-600">{paymentData.orderId}</span>
              </div>
              {paymentData.paymentId && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment ID:</span>
                  <span className="text-sm text-gray-600">{paymentData.paymentId}</span>
                </div>
              )}
              {paymentData.amount && paymentData.currency && (
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="text-sm text-gray-600">
                    {paymentData.currency} {paymentData.amount}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Your membership will be activated shortly. You can check your membership status in your dashboard.
            </p>
            
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/memberDashboard/memberships">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View My Memberships
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/memberDashboard">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}