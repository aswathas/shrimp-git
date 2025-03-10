"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator } from "lucide-react";

export default function CountEstimationPage() {
  const [pondAge, setPondAge] = useState("");
  const [foodIntake, setFoodIntake] = useState("");
  const [season, setSeason] = useState("");
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null);

  const calculateCount = () => {
    // This is a simplified estimation model
    // In a real application, this would be based on more complex calculations or ML models
    const age = parseFloat(pondAge);
    const food = parseFloat(foodIntake);

    let seasonMultiplier = 1;
    switch (season) {
      case "summer":
        seasonMultiplier = 1.2;
        break;
      case "winter":
        seasonMultiplier = 0.8;
        break;
      case "rainy":
        seasonMultiplier = 1;
        break;
    }

    // Basic formula: (base count * age factor * food factor * season multiplier)
    const baseCount = 30; // Average base count
    const ageFactor = Math.max(0.5, 1 - age / 150); // Age impact
    const foodFactor = food / 1000; // Food intake impact

    const count = baseCount * ageFactor * foodFactor * seasonMultiplier;
    setEstimatedCount(parseFloat(count.toFixed(2)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Removed Header component */}
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Prawn Count Estimation</h1>
            <Button className="gap-2" onClick={calculateCount}>
              <Calculator className="h-4 w-4" />
              Calculate Count
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
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                      <SelectItem value="rainy">Rainy</SelectItem>
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
                    Younger ponds typically have higher counts per KG as prawns
                    are smaller. Count decreases as prawns grow larger with age.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Food Intake</h3>
                  <p className="text-sm text-muted-foreground">
                    Higher food intake generally indicates larger prawns,
                    resulting in lower count per KG. Adjusted for the standard
                    base of 1 lakh prawns.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Seasonal Variation</h3>
                  <p className="text-sm text-muted-foreground">
                    Growth rates vary by season: faster in summer, slower in
                    winter, and moderate in rainy season, affecting the count
                    per KG.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
