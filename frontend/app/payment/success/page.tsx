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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your membership has been purchased successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentData && (
            <div className="bg-secondary p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Order ID:</span>
                <span className="text-sm text-muted-foreground">{paymentData.orderId}</span>
              </div>
              {paymentData.paymentId && (
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Payment ID:</span>
                  <span className="text-sm text-muted-foreground">{paymentData.paymentId}</span>
                </div>
              )}
              {paymentData.amount && paymentData.currency && (
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Amount:</span>
                  <span className="text-sm text-muted-foreground">
                    {paymentData.currency} {paymentData.amount}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg border border-border">
              <p className="text-foreground font-medium text-sm mb-1">
                Membership Activation in Progress
              </p>
              <p className="text-muted-foreground text-xs">
                Your membership will be automatically activated within 60 seconds. You&apos;ll see it in your dashboard shortly!
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                asChild 
                className="w-full"
                onClick={() => console.log('View My Memberships clicked')}
              >
                <Link href="/memberDashboard/memberships/my-memberships">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View My Memberships
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                className="w-full bg-white hover:bg-gray-100 text-black border-gray-300"
                onClick={() => console.log('Go to Dashboard clicked')}
              >
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