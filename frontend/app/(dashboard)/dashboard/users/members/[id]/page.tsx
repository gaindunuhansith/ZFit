"use client"

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  MapPin,
  AlertTriangle
} from 'lucide-react'
import { getUserById } from '@/lib/api/userApi'
import { QRCodeModal } from '@/components/QRCodeModal'

interface MemberDetails {
  _id: string
  name: string
  email: string
  contactNo: string
  role: string
  status: string
  verified: boolean
  qrCode?: string
  createdAt: string
  updatedAt: string
  dob?: string
  profile?: {
    address?: string
    emergencyContact?: string
    avatar?: string
  }
  consent?: {
    gdpr?: boolean
    marketing?: boolean
    date?: string
  }
  fitnessGoals?: string[]
}

export default function MemberDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const memberId = params.id as string

  const [member, setMember] = useState<MemberDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showQRModal, setShowQRModal] = useState(false)

  const fetchMemberDetails = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getUserById(memberId)

      if (response.success && response.data) {
        setMember(response.data as MemberDetails)
      } else {
        setError(response.message || 'Failed to fetch member details')
      }
    } catch (err) {
      console.error('Error fetching member details:', err)
      setError('Failed to load member details')
    } finally {
      setLoading(false)
    }
  }, [memberId])

  useEffect(() => {
    if (memberId) {
      fetchMemberDetails()
    }
  }, [memberId, fetchMemberDetails])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'expired':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'member':
        return 'default'
      case 'staff':
        return 'secondary'
      case 'manager':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading member details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Member</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'Member not found'}
              </p>
              <Button onClick={() => router.back()}>
                Back to Members
              </Button>
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
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Member Details</h2>
          <p className="text-muted-foreground">
            Complete information for {member.name}
          </p>
        </div>
        {member.qrCode && (
          <Button onClick={() => setShowQRModal(true)}>
            View QR Code
          </Button>
        )}
      </div>

      {/* Member Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Basic account information and contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={member.profile?.avatar || "/avatars/user.jpg"} alt={member.name} />
                <AvatarFallback className="text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold">{member.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="font-medium">{member.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
                <p className="font-medium">{member.contactNo}</p>
              </div>

              {member.dob && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </div>
                  <p className="font-medium">
                    {new Date(member.dob).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Verification Status
                </div>
                <p className="font-medium">
                  {member.verified ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-yellow-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Pending Verification
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </div>
                <p className="font-medium">
                  {new Date(member.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Account Created
                </div>
                <p className="font-medium">
                  {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Address */}
            {member.profile?.address && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <p className="font-medium">{member.profile.address}</p>
                </div>
              </>
            )}

            {/* Fitness Goals */}
            {member.fitnessGoals && member.fitnessGoals.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Fitness Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.fitnessGoals.map((goal, index) => (
                      <Badge key={index} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Emergency Contact */}
            {member.profile?.emergencyContact && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Emergency Contact</h4>
                  <p className="text-sm">{member.profile.emergencyContact}</p>
                </div>
              </>
            )}

            {/* Consent Information */}
            {member.consent && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Privacy & Consent</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    <p className="text-sm">
                      <span className="font-medium">GDPR Consent:</span> {member.consent.gdpr ? 'Granted' : 'Not Granted'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Marketing Consent:</span> {member.consent.marketing ? 'Opted In' : 'Opted Out'}
                    </p>
                    {member.consent.date && (
                      <p className="text-sm md:col-span-2">
                        <span className="font-medium">Consent Date:</span> {new Date(member.consent.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Summary
            </CardTitle>
            <CardDescription>
              Account status and key information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusBadgeVariant(member.status)}>
                  {member.status}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Verified</span>
                {member.verified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-yellow-500" />
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Member ID</span>
                <span className="text-sm font-mono">{member._id.slice(-8)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Account Timeline</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Created:</span> {new Date(member.createdAt).toLocaleDateString()}</p>
                <p><span className="text-muted-foreground">Updated:</span> {new Date(member.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      {member.qrCode && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          qrCodeData={member.qrCode}
          userName={member.name}
        />
      )}
    </div>
  )
}