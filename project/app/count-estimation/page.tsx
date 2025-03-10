"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calculator } from "lucide-react"

export default function CountEstimationPage() {
  const [pondAge, setPondAge] = useState("")
  const [foodIntake, setFoodIntake] = useState("")
  const [season, setSeason] = useState("")
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateCount = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          Age_of_Pond: pondAge,
          Food_Intake: foodIntake,
          Season: season,
        }),
      })
      const data = await response.json()
      if (data.prediction !== undefined) {
        setEstimatedCount(data.prediction)
      } else if (data.error) {
        console.error("Error:", data.error)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Removed Header component */}
      <div className="flex">
       
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Prawn Count Estimation</h1>
            <Button className="gap-2" onClick={calculateCount} disabled={loading}>
              <Calculator className="h-4 w-4" />
              {loading ? "Calculating..." : "Calculate Count"}
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Age of Pond (days)</Label>
                  <Input 
                    type="number" 
                    placeholder="Enter pond age" 
                    value={pondAge}
                    onChange={(e) => setPondAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Food Intake per Day (per 1 lakh prawns)</Label>
                  <Input 
                    type="number" 
                    placeholder="Enter food intake" 
                    value={foodIntake}
                    onChange={(e) => setFoodIntake(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Season</Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                      <SelectItem value="Rainy">Rainy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimation Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[200px]">
                  {estimatedCount !== null ? (
                    <>
                      <div className="text-4xl font-bold mb-2">
                        {estimatedCount}
                      </div>
                      <p className="text-muted-foreground">
                        Estimated prawns per KG
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Enter parameters and click Calculate to see estimation
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Estimation Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="font-semibold mb-2">Age Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Younger ponds typically have higher counts per KG as prawns are smaller.
                    Count decreases as prawns grow larger with age.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Food Intake</h3>
                  <p className="text-sm text-muted-foreground">
                    Higher food intake generally indicates larger prawns, resulting in lower count per KG.
                    Adjusted for the standard base of 1 lakh prawns.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Seasonal Variation</h3>
                  <p className="text-sm text-muted-foreground">
                    Growth rates vary by season: faster in summer, slower in winter, and moderate in rainy season,
                    affecting the count per KG.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}