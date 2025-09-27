"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { membershipApi, type Membership } from "@/lib/api/membershipApi"

export default function MyMembershipsPage() {
  const { user } = useAuth()
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMemberships = useCallback(async () => {
    if (!user?._id) {
      console.log('No user ID available for fetching memberships')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching memberships for user:', user._id)
      const response = await membershipApi.getUserMemberships(user._id)
      console.log('Memberships API response:', response)
      setMemberships(response.data || [])
      console.log('Memberships set:', response.data || [])
    } catch (err) {
      console.error('Failed to fetch memberships:', err)
      setError('Failed to load your memberships. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [user?._id])

  useEffect(() => {
    fetchMemberships()
  }, [fetchMemberships])

  console.log('Component render - memberships:', memberships)
  console.log('Component render - memberships.length:', memberships.length)
  console.log('Component render - loading:', loading)

  const getStatusBadge = (status: Membership['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case 'expired':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            <PauseCircle className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (endDate: string, status: Membership['status']) => {
    if (status !== 'active') return null

    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Expires today'
    if (diffDays === 1) return '1 day left'
    return `${diffDays} days left`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Memberships</h2>
          <p className="text-muted-foreground">
            View and manage your gym memberships
          </p>
        </div>

        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Memberships</h2>
          <p className="text-muted-foreground">
            View and manage your gym memberships
          </p>
        </div>

        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>

        <Button onClick={fetchMemberships} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Memberships</h2>
          <p className="text-muted-foreground">
            View and manage your gym memberships
          </p>
        </div>
        <Button onClick={fetchMemberships} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      
      {memberships.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Memberships Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              You don&apos;t have any memberships yet. Browse available membership plans to get started.
            </p>
            <Button>
              Browse Memberships
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {memberships.map((membership) => {
            const membershipPlan = typeof membership.membershipPlanId === 'object' && membership.membershipPlanId !== null
              ? membership.membershipPlanId
              : null
            const daysRemaining = getDaysRemaining(membership.endDate, membership.status)

            return (
              <Card key={membership._id} className={membership.status === 'active' ? 'border-green-200' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {membershipPlan?.name || 'Membership Plan'}
                      </CardTitle>
                      <CardDescription>
                        {membershipPlan?.category && `${membershipPlan.category} • `}
                        {membershipPlan?.durationInDays} days duration
                      </CardDescription>
                    </div>
                    {getStatusBadge(membership.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Start Date
                      </div>
                      <p className="font-medium">{formatDate(membership.startDate)}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        End Date
                      </div>
                      <p className="font-medium">{formatDate(membership.endDate)}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Status
                      </div>
                      <div className="flex items-center gap-2">
                        {daysRemaining && membership.status === 'active' && (
                          <Badge variant={daysRemaining.includes('Expired') ? 'destructive' : 'secondary'}>
                            {daysRemaining}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Price: {membershipPlan?.currency} {membershipPlan?.price}
                        {membership.transactionId && (
                          <span className="ml-4">
                            Transaction: {membership.transactionId}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {membership.status === 'active' && (
                          <>
                            <Button variant="outline" size="sm">
                              Extend
                            </Button>
                            <Button variant="outline" size="sm">
                              Pause
                            </Button>
                          </>
                        )}
                        {membership.status === 'paused' && (
                          <Button variant="outline" size="sm">
                            Resume
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {membership.notes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {membership.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}