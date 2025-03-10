"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Droplet, ThermometerSun, Wind, AlertCircle } from "lucide-react";

const waterQualityData = [
  { time: "00:00", ph: 7.2, temperature: 26, oxygen: 6.5, salinity: 15 },
  { time: "04:00", ph: 7.1, temperature: 25, oxygen: 6.2, salinity: 14 },
  { time: "08:00", ph: 7.3, temperature: 27, oxygen: 6.8, salinity: 15 },
  { time: "12:00", ph: 7.4, temperature: 28, oxygen: 7.0, salinity: 16 },
  { time: "16:00", ph: 7.2, temperature: 27, oxygen: 6.7, salinity: 15 },
  { time: "20:00", ph: 7.1, temperature: 26, oxygen: 6.4, salinity: 14 },
];

export default function WaterQualityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Water Quality</h1>
            <Button className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Configure Alerts
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">7.2</div>
                  <Badge>Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 6.5-8.5
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Temperature
                </CardTitle>
                <ThermometerSun className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">26.5°C</div>
                  <Badge>Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 25-30°C
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Dissolved Oxygen
                </CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">6.8 mg/L</div>
                  <Badge>Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 5-8 mg/L
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salinity</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">15 ppt</div>
                  <Badge>Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 10-20 ppt
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historical Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={waterQualityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      scale="point"
                      padding={{ left: 10, right: 10 }}
                      tick={{ fill: "hsl(var(--foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      scale="linear"
                      tick={{ fill: "hsl(var(--foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ph"
                      stroke="hsl(var(--chart-1))"
                      name="pH"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(var(--chart-2))"
                      name="Temperature (°C)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="oxygen"
                      stroke="hsl(var(--chart-3))"
                      name="Dissolved Oxygen (mg/L)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="salinity"
                      stroke="hsl(var(--chart-4))"
                      name="Salinity (ppt)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
