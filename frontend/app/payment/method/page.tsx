"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Building2, ArrowRight, Loader2 } from "lucide-react"
import { initiatePayHerePayment, type PayHerePaymentRequest } from "@/lib/api/paymentApi"
import { useAuth } from "@/lib/auth-context"

interface PaymentData {
  planId: string
  planName: string
  amount: number
  currency: string
  type: string
  description: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
}

export default function PaymentMethodPage() {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      setError('You must be logged in to access this page.')
      return
    }

    // Load payment data from localStorage
    const storedData = localStorage.getItem('membershipPaymentData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setPaymentData(parsedData)
      } catch (err) {
        console.error('Error parsing payment data:', err)
        setError('Invalid payment data. Please try purchasing again.')
      }
    } else {
      setError('No payment data found. Please select a membership plan first.')
    }
  }, [user])

  const handleMethodSelect = (method: 'card' | 'bank') => {
    setSelectedMethod(method)
    setError(null)
  }

  const handleProceed = async () => {
    if (!selectedMethod || !paymentData) return

    if (!user) {
      setError('You must be logged in to make a payment.')
      return
    }

    if (selectedMethod === 'card') {
      setIsProcessing(true)
      setError(null)

      try {
        // Prepare PayHere payment request
        const paymentRequest: PayHerePaymentRequest = {
          userId: user?._id || '',
          amount: paymentData.amount,
          currency: paymentData.currency,
          type: 'membership' as const,
          relatedId: paymentData.planId,
          description: paymentData.description,
          customerFirstName: paymentData.customerFirstName,
          customerLastName: paymentData.customerLastName,
          customerEmail: paymentData.customerEmail,
          customerPhone: paymentData.customerPhone,
          customerAddress: paymentData.customerAddress,
          customerCity: paymentData.customerCity,
        }

        console.log('Initiating PayHere payment:', paymentRequest)

        const response = await initiatePayHerePayment(paymentRequest)

        if (response.paymentForm) {
          console.log('Payment form received, submitting...')

          // Create form in current window and submit immediately
          const formContainer = document.createElement('div')
          formContainer.innerHTML = response.paymentForm
          document.body.appendChild(formContainer)

          // Find the form and submit it manually
          const paymentForm = document.getElementById('payhere-form') as HTMLFormElement
          if (paymentForm) {
            setTimeout(() => {
              paymentForm.submit()
            }, 100)
          } else {
            throw new Error('Payment form element not found')
          }
        } else {
          throw new Error('Payment form not received')
        }
      } catch (err) {
        console.error('Payment initiation failed:', err)
        setError('Failed to initiate payment. Please try again.')
        setIsProcessing(false)
      }
    } else if (selectedMethod === 'bank') {
      // For bank transfer, you could redirect to a bank transfer instructions page
      console.log('Bank transfer selected - showing instructions')
      // For now, just show an alert
      alert('Bank transfer instructions would be shown here. Please contact support for bank details.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">
            Choose Payment Method
          </CardTitle>
          <CardDescription className="text-lg">
            Select how you'd like to complete your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Options */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Card Payment Option */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedMethod === 'card'
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleMethodSelect('card')}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Card Payment
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Pay securely with your credit or debit card through our payment gateway
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Supported cards:</p>
                  <p className="text-xs font-medium text-foreground">
                    Visa, MasterCard, American Express
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bank Transfer Option */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedMethod === 'bank'
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleMethodSelect('bank')}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Bank Transfer
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Transfer directly from your bank account to our account
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Processing time:</p>
                  <p className="text-xs font-medium text-foreground">
                    1-3 business days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedMethod(null)}
              disabled={!selectedMethod}
            >
              Change Selection
            </Button>
            <Button
              className="flex-1"
              onClick={handleProceed}
              disabled={!selectedMethod}
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Additional Information */}
          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              All payments are processed securely and your information is protected
            </p>
            <p className="text-xs text-muted-foreground">
              Need help? Contact our support team for assistance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}