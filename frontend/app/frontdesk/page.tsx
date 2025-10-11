"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, UserPlus, CheckCircle } from "lucide-react"

export default function FrontDeskPage() {
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipPlan: "",
  })

  const [checkInResult, setCheckInResult] = useState<string | null>(null)

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration data:", registrationData)
    alert("Registration submitted successfully!")
  }

  const handleCheckIn = () => {
    // Simulate QR code scanning
    setCheckInResult("Check-in successful! Welcome to ZFit!")
    setTimeout(() => setCheckInResult(null), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="register" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Register for Gym
            </TabsTrigger>
            <TabsTrigger value="checkin" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Check In
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Gym Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={registrationData.name}
                        onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="07XXXXXXXX"
                        value={registrationData.phone}
                        onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan">Membership Plan</Label>
                      <Select onValueChange={(value) => setRegistrationData({...registrationData, membershipPlan: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Monthly - $29.99</SelectItem>
                          <SelectItem value="premium">Premium Monthly - $49.99</SelectItem>
                          <SelectItem value="annual">Annual Plan - $299.99</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Register Now
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkin" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Check-In
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="mx-auto w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">QR Code Scanner</p>
                      <p className="text-xs text-gray-400">Position QR code within frame</p>
                    </div>
                  </div>
                  <Button onClick={handleCheckIn} className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR Code
                  </Button>
                </div>

                {checkInResult && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">{checkInResult}</span>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p>Scan your membership QR code to check in to the gym.</p>
                  <p>If you don&apos;t have a QR code, please register first.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}