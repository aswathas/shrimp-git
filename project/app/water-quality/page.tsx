"use client";

import { useState, useEffect } from "react";
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

export default function WaterQualityPage() {
const [waterQualityData, setWaterQualityData] = useState<{ time: string; ph: number; temperature: number; oxygen: number; salinity: number; tds: number; }[]>([]);


  useEffect(() => {
    const fetchWaterQualityData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/read_sensor");
        if (response.ok) {
          const data = await response.json();
          setWaterQualityData((prevData) => [
            ...prevData,
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              ph: data.pH,
              temperature: data.temperature,
              oxygen: data.oxygen,
              salinity: data.salinity,
              tds: data.tds, // Added TDS to the response

            },
          ]);
        } else {
          console.error("Error fetching sensor data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchWaterQualityData();
    const interval = setInterval(fetchWaterQualityData, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

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
                  <div className="text-2xl font-bold">{waterQualityData.length > 0 ? waterQualityData[waterQualityData.length - 1].ph.toFixed(1) : 'Loading...'}</div>
                  <Badge>Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 6.5-8.5
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <ThermometerSun className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{waterQualityData.length > 0 ? waterQualityData[waterQualityData.length - 1].temperature.toFixed(1) + '°C' : 'Loading...'}</div>
                  <Badge>Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 25-30°C
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{waterQualityData.length > 0 ? (typeof waterQualityData[waterQualityData.length - 1].oxygen === 'number' ? waterQualityData[waterQualityData.length - 1].oxygen.toFixed(1) : 'N/A') + ' mg/L' : 'Loading...'}</div>
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
                  <div className="text-2xl font-bold">{waterQualityData.length > 0 ? (typeof waterQualityData[waterQualityData.length - 1].salinity === 'number' ? waterQualityData[waterQualityData.length - 1].salinity.toFixed(1) : 'N/A') + ' ppt' : 'Loading...'} | TDS: {waterQualityData.length > 0 ? (typeof waterQualityData[waterQualityData.length - 1].tds === 'number' ? waterQualityData[waterQualityData.length - 1].tds.toFixed(1) : 'N/A') + ' ppm' : 'Loading...'}</div>

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
