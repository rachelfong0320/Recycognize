"use client"
import { generateESGPdfReport } from "@/lib/pdf-export"
import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/components/auth-provider"
import { generateCSV, calculateESGMetrics, generateESGReport } from "@/lib/export-utils"
import { mockBrandData, hasAccessToBrand } from "@/lib/auth"
import { Download, FileText, CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface ExportDialogProps {
  trigger: React.ReactNode
}

export function ExportDialog({ trigger }: ExportDialogProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [exportType, setExportType] = useState<"csv" | "esg">("csv")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [isExporting, setIsExporting] = useState(false)

  if (!user) return null

  const handleExport = async () => {
  setIsExporting(true);

  try {
    const accessibleData = mockBrandData.filter((item) => hasAccessToBrand(user, item.name))


    if (exportType === "csv") {
      const filename = `${user.brand}-analytics-${format(
        new Date(),
        "yyyy-MM-dd"
      )}`;
      generateCSV(accessibleData, filename);
    } else if (exportType === "esg") {
      const metrics = calculateESGMetrics(accessibleData)

      const breakdown = [
        { material: "PET Plastic", percentage: 40 },
        { material: "Aluminum", percentage: 35 },
        { material: "Glass", percentage: 15 },
        { material: "Carton/Others", percentage: 10 },
      ];

      const compliance = [
        { name: "EU Packaging Directive", status: "Compliant" },
        { name: "Circular Economy Action Plan", status: "Aligned" },
        { name: "Carbon Neutrality Targets", status: "In Progress" },
        { name: "Material Disclosure Requirements", status: "Reported" },
      ];

      const pdf = generateESGPdfReport(user.brand,metrics, breakdown, compliance);

      pdf.save(
        `${user.brand}-ESG-Report-${format(new Date(), "yyyy-MM-dd")}.pdf`
      );
    }

    setIsOpen(false);
  } catch (error) {
    console.error("Export failed:", error);
  } finally {
    setIsExporting(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>Choose your export format and date range for {user.brand} analytics</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-colors ${
                exportType === "csv" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setExportType("csv")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    CSV Export
                  </CardTitle>
                  {exportType === "csv" && <Badge>Selected</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Raw data export with brand detections, materials, confidence scores, and timestamps. Perfect for
                  further analysis in Excel or other tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-colors ${
                exportType === "esg" ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setExportType("esg")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    ESG Metrics
                  </CardTitle>
                  {exportType === "esg" && <Badge>Selected</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive sustainability report with environmental metrics, compliance status, and recommendations
                  for stakeholders.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Date Range</h4>
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <span className="text-gray-500">to</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Export Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Format:</strong> {exportType === "csv" ? "CSV File" : "ESG Metrics Export (Markdown)"}
              </p>
              <p>
                <strong>Brand:</strong> {user.brand}
              </p>
              <p>
                <strong>Date Range:</strong> {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                {format(dateRange.to, "MMM dd, yyyy")}
              </p>
              <p>
                <strong>Estimated Records:</strong>{" "}
                {mockBrandData.filter((item) => hasAccessToBrand(user, item.name)).length}
              </p>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export {exportType === "csv" ? "CSV" : "ESG Metrics Export"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
