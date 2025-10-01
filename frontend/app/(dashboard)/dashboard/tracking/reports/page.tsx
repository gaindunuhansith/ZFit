"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trackingApi } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"
import { Download, FileText, Table, Calendar, TrendingUp, Target, Apple, Dumbbell } from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      
      const params = {
        memberId: user?._id,
        type: reportType,
        format: reportFormat,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/reports/tracking?${new URLSearchParams({
        ...(params.memberId && { memberId: params.memberId }),
        type: params.type,
        format: params.format,
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate })
      })}`)

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      const fileName = `tracking-report-${reportType}-${new Date().toISOString().split('T')[0]}.${reportFormat === 'pdf' ? 'pdf' : 'xlsx'}`
      a.download = fileName
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('Report generated successfully')
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getDateRangeDescription = () => {
    const now = new Date()
    switch (reportType) {
      case 'daily':
        return `Today (${now.toLocaleDateString()})`
      case 'weekly':
        const startOfWeek = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000)
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
        return `This week (${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()})`
      case 'monthly':
        return `This month (${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`
      case 'yearly':
        return `This year (${now.getFullYear()})`
      default:
        return 'Custom date range'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate detailed reports of your fitness tracking data
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Report Configuration
            </CardTitle>
            <CardDescription>
              Configure your report settings and generate downloads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Period</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="yearly">Yearly Report</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {getDateRangeDescription()}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-format">Report Format</Label>
              <Select value={reportFormat} onValueChange={(value: any) => setReportFormat(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF Document
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center">
                      <Table className="h-4 w-4 mr-2" />
                      Excel Spreadsheet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Report Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Report Preview
            </CardTitle>
            <CardDescription>
              What will be included in your report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Dumbbell className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Workout Data</p>
                  <p className="text-sm text-muted-foreground">
                    Exercise logs, sets, reps, and weights
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Apple className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Nutrition Data</p>
                  <p className="text-sm text-muted-foreground">
                    Meal logs, calories, and macronutrients
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Goals & Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Goal tracking and progress metrics
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Summary Statistics</p>
                  <p className="text-sm text-muted-foreground">
                    Totals, averages, and trends
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setReportType('daily'); setReportFormat('pdf'); }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Daily PDF</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setReportType('weekly'); setReportFormat('excel'); }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Table className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Weekly Excel</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setReportType('monthly'); setReportFormat('pdf'); }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Monthly PDF</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setReportType('yearly'); setReportFormat('excel'); }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Table className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Yearly Excel</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
