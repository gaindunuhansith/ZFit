"use client"

import { UserProfile } from "@/components/user-profile"

export default function MemberProfilePage() {
  return (
    <UserProfile
      showFitnessStats={true}
      showPaymentHistory={true}
      showAccountSettings={true}
    />
  )
}