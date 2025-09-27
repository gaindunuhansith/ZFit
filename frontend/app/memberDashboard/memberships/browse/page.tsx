"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Dumbbell,
  Filter,
  Star,
  Clock,
  Zap,
  Heart,
  Target
} from "lucide-react"
import { membershipPlanApi, type MembershipPlan } from "@/lib/api/membershipPlanApi"

const categoryIcons = {
  weights: Dumbbell,
  crossfit: Zap,
  yoga: Heart,
  mma: Target,
  other: Star,
}

const categoryColors = {
  weights: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  crossfit: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  yoga: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  mma: "bg-red-100 text-red-800 hover:bg-red-100",
  other: "bg-gray-100 text-gray-800 hover:bg-gray-100",
}

export default function BrowseMembershipsPage() {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("price-asc")

  useEffect(() => {
    fetchMembershipPlans()
  }, [])

  const fetchMembershipPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await membershipPlanApi.getAllMembershipPlans()
      setMembershipPlans(response.data || [])
    } catch (err) {
      console.error('Failed to fetch membership plans:', err)
      setError('Failed to load membership plans. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPlans = useCallback(() => {
    let filtered = membershipPlans

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(plan => plan.category === selectedCategory)
    }

    // Sort plans
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "duration-asc":
          return a.durationInDays - b.durationInDays
        case "duration-desc":
          return b.durationInDays - a.durationInDays
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredPlans(filtered)
  }, [membershipPlans, selectedCategory, sortBy])

  useEffect(() => {
    filterAndSortPlans()
  }, [membershipPlans, selectedCategory, sortBy, filterAndSortPlans])

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Star
    return <IconComponent className="h-4 w-4" />
  }

  const getCategoryBadge = (category: string) => {
    const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.other
    return (
      <Badge variant="secondary" className={colorClass}>
        {getCategoryIcon(category)}
        <span className="ml-1 capitalize">{category}</span>
      </Badge>
    )
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'LKR' ? 'LKR' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getDurationText = (days: number) => {
    if (days === 30) return "1 Month"
    if (days === 90) return "3 Months"
    if (days === 180) return "6 Months"
    if (days === 365) return "1 Year"
    return `${days} Days`
  }

  const handlePurchase = (plan: MembershipPlan) => {
    // TODO: Implement purchase flow
    console.log('Purchasing plan:', plan)
    // This would typically navigate to a payment page or open a purchase modal
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Browse Memberships</h2>
          <p className="text-muted-foreground">
            Choose the perfect membership plan for your fitness journey
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
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
          <h2 className="text-3xl font-bold tracking-tight">Browse Memberships</h2>
          <p className="text-muted-foreground">
            Choose the perfect membership plan for your fitness journey
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
              <CreditCard className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Plans</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchMembershipPlans}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categories = ["all", ...Array.from(new Set(membershipPlans.map(plan => plan.category)))]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Browse Memberships</h2>
        <p className="text-muted-foreground">
          Choose the perfect membership plan for your fitness journey
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="duration-asc">Duration: Short to Long</SelectItem>
            <SelectItem value="duration-desc">Duration: Long to Short</SelectItem>
            <SelectItem value="name">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPlans.length} membership plan{filteredPlans.length !== 1 ? 's' : ''}
        {selectedCategory !== "all" && ` in ${selectedCategory} category`}
      </div>

      {filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Plans Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {selectedCategory === "all"
                ? "No membership plans are currently available."
                : `No membership plans found in the ${selectedCategory} category.`
              }
            </p>
            {selectedCategory !== "all" && (
              <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                View All Plans
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <Card key={plan._id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {getCategoryBadge(plan.category)}
                    </CardDescription>
                  </div>
                  {getCategoryIcon(plan.category)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Price */}
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(plan.price, plan.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per {getDurationText(plan.durationInDays).toLowerCase()}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{getDurationText(plan.durationInDays)}</span>
                  </div>

                  {/* Description */}
                  {plan.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {plan.description}
                    </p>
                  )}

                  {/* Purchase Button */}
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(plan)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Purchase Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}