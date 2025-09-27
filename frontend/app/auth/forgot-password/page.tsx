"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { authApi } from "@/lib/api/authApi"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await authApi.sendPasswordResetEmail(email)

      if (response.success) {
        setSuccess(true)
      } else {
        setError(response.message || "Failed to send reset email")
      }
    } catch (error: unknown) {
      console.error("Forgot password error:", error)
      setError(error instanceof Error ? error.message : "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-black px-4">
          <div className="w-full max-w-sm mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-gray-400">
                We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
            </div>

            <div className="p-6 bg-[#202022] border border-gray-700 rounded-md mb-6">
              <Mail className="h-12 w-12 text-[#AAFF69] mx-auto mb-4" />
              <p className="text-gray-300 text-sm">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-[#AAFF69] hover:underline"
                >
                  try again
                </button>
              </p>
            </div>

            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full px-8 py-5 bg-white hover:bg-gray-100 text-black border border-gray-300"
            >
              Back to Login
            </Button>
          </div>
        </div>
        <div className="pb-8 text-center">
          <div className="flex justify-center space-x-6 text-xs">
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
              Terms and Conditions
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-400">No worries! Enter your email and we&apos;ll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-300 block mb-3">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 bg-[#202022] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#AAFF69] focus:ring-[#AAFF69]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full px-8 py-5 bg-white hover:bg-gray-100 text-black border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="inline-flex items-center text-gray-400 hover:text-gray-200 text-sm font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <div className="pb-8 text-center">
        <div className="flex justify-center space-x-6 text-xs">
          <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
            Terms and Conditions
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}