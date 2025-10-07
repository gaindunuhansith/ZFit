"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { trackingApi } from "@/lib/api/trackingApi"
import { useAuth } from "@/lib/auth-context"

export default function MemberReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel">("pdf")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      const params = {
        memberId: user?._id, // Members can only generate their own reports
        type: reportType,
        format: reportFormat,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }

      const response = await trackingApi.generateReport(params)

      if (response.success && response.data) {
        const blob = new Blob([response.data], {
          type: reportFormat === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `my_tracking_report_${reportType}.${reportFormat}`
        document.body.appendChild(a)
        a.click()
        a.remove()
        console.log("Report generated successfully")
      } else {
        console.error("Failed to generate report:", response.error)
      }
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports of your fitness progress and activities.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Personal Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") => setReportType(value)}>
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportFormat">Format</Label>
              <Select value={reportFormat} onValueChange={(value: "pdf" | "excel") => setReportFormat(value)}>
                <SelectTrigger id="reportFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Excel
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Report Includes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Workout sessions with exercises, sets, reps, and weights</li>
              <li>• Nutrition entries with calories and macronutrients</li>
              <li>• Goal progress and completion status</li>
              <li>• Summary statistics and trends</li>
              <li>• Progress charts and visualizations</li>
            </ul>
          </div>

          <Button onClick={handleGenerateReport} disabled={loading} className="w-full">
            {loading ? "Generating..." : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate My Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              PDF Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Generate professional PDF reports with charts and detailed analysis of your fitness progress.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Professional formatting</li>
              <li>• Charts and graphs</li>
              <li>• Easy to share and print</li>
              <li>• Complete activity summary</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Excel Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Export your data to Excel for detailed analysis and custom calculations.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Multiple data sheets</li>
              <li>• Raw data for analysis</li>
              <li>• Custom calculations</li>
              <li>• Data manipulation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
