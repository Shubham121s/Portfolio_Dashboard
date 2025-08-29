"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExcelUploadDialogProps {
  onDataImported: () => void
}

interface ExcelRowData {
  [key: string]: any
}

export function ExcelUploadDialog({ onDataImported }: ExcelUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<ExcelRowData[]>([])
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (
      !selectedFile.name.endsWith(".xlsx") &&
      !selectedFile.name.endsWith(".xls") &&
      !selectedFile.name.endsWith(".csv")
    ) {
      setError("Please select a valid Excel file (.xlsx, .xls) or CSV file (.csv)")
      return
    }

    setFile(selectedFile)
    setError(null)

    try {
      let data: ExcelRowData[]

      if (selectedFile.name.endsWith(".csv")) {
        data = await parseCSVFile(selectedFile)
      } else {
        setError("Please save your Excel file as CSV format and upload again. This ensures better compatibility.")
        return
      }

      setPreviewData(data.slice(0, 5)) // Show first 5 rows for preview
    } catch (err) {
      setError("Error reading file. Please check the file format.")
      console.error("File parsing error:", err)
    }
  }

  const parseCSVFile = (file: File): Promise<ExcelRowData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split("\n").filter((line) => line.trim())

          if (lines.length < 2) {
            reject(new Error("File must have at least a header row and one data row"))
            return
          }

          const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
          const data = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
            const row: ExcelRowData = {}
            headers.forEach((header, index) => {
              row[header] = values[index] || ""
            })
            return row
          })

          resolve(data)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error("File reading failed"))
      reader.readAsText(file)
    })
  }

  const mapExcelDataToPortfolio = (data: ExcelRowData[]) => {
    return data
      .map((row, index) => {
        // Common Excel column mappings - adjust based on your Excel format
        const stockName = row["Stock Name"] || row["stock_name"] || row["Name"] || row["Symbol"] || `Stock ${index + 1}`
        const purchasePrice = Number.parseFloat(row["Purchase Price"] || row["purchase_price"] || row["Price"] || "0")
        const quantity = Number.parseInt(row["Quantity"] || row["quantity"] || row["Qty"] || "0")
        const exchange = row["Exchange"] || row["exchange"] || row["NSE/BSE"] || "NSE"
        const sector = row["Sector"] || row["sector"] || "Others"

        return {
          stock_symbol: stockName.toUpperCase().replace(/\s+/g, ""),
          stock_name: stockName,
          purchase_price: purchasePrice,
          quantity: quantity,
          sector: sector,
          exchange_code: exchange.toUpperCase(),
        }
      })
      .filter((item) => item.stock_name && item.purchase_price > 0 && item.quantity > 0)
  }

  const handleImport = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      let excelData: ExcelRowData[]

      if (file.name.endsWith(".csv")) {
        excelData = await parseCSVFile(file)
      } else {
        setError("Please use CSV format for now")
        setIsLoading(false)
        return
      }

      const portfolioData = mapExcelDataToPortfolio(excelData)

      if (portfolioData.length === 0) {
        setError("No valid portfolio data found in the file")
        setIsLoading(false)
        return
      }

      let successCount = 0
      let errorCount = 0

      for (const holding of portfolioData) {
        try {
          const response = await fetch("/api/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(holding),
          })

          if (response.ok) {
            successCount++
          } else {
            errorCount++
            console.error("Failed to import holding:", holding.stock_name)
          }
        } catch (err) {
          errorCount++
          console.error("Error importing holding:", holding.stock_name, err)
        }
      }

      if (successCount > 0) {
        onDataImported()
        setIsOpen(false)
        setFile(null)
        setPreviewData([])

        if (errorCount > 0) {
          setError(`Imported ${successCount} holdings successfully, ${errorCount} failed`)
        }
      } else {
        setError("Failed to import any holdings. Please check the data format.")
      }
    } catch (err) {
      setError("Error importing data. Please check the file format.")
      console.error("Import error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent cursor-pointer">
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Portfolio from CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="mt-1" />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewData.length > 0 && (
            <div>
              <Label>Preview (First 5 rows):</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {Object.keys(previewData[0]).map((key) => (
                          <th key={key} className="px-3 py-2 text-left font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Expected CSV Format:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Save your Excel file as CSV (Comma Separated Values)</p>
              <p>
                • <strong>Stock Name</strong> - Company name or symbol
              </p>
              <p>
                • <strong>Purchase Price</strong> - Price per share
              </p>
              <p>
                • <strong>Quantity</strong> - Number of shares
              </p>
              <p>
                • <strong>Exchange</strong> - NSE/BSE (optional)
              </p>
              <p>
                • <strong>Sector</strong> - Stock sector (optional)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isLoading || previewData.length === 0}>
              {isLoading ? "Importing..." : `Import ${previewData.length} Holdings`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
