"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Droplet,
  ThermometerSun,
  Wind,
  Salad as Salt,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSensorData } from "@/hooks/use-sensor-data";
import { MetricConfig } from "@/lib/types";

const METRICS: MetricConfig[] = [
  {
    name: "pH Level",
    value: 7.2,
    type: "ph",
    icon: Droplet,
    ranges: { min: 7.0, max: 8.5, warningThreshold: 0.2 },
  },
  {
    name: "Ammonia",
    value: 0.4,
    type: "ammonia",
    unit: "mg/L",
    icon: AlertCircle,
    ranges: { min: 0, max: 0.5, warningThreshold: 0.1 },
  },
  {
    name: "Salinity",
    value: 15,
    type: "salinity",
    unit: "ppt",
    icon: Salt,
    ranges: { min: 12, max: 20, warningThreshold: 2 },
  },
  {
    name: "Dissolved Oxygen",
    value: 6.8,
    type: "oxygen",
    unit: "mg/L",
    icon: Wind,
    ranges: { min: 6.0, max: 8.0, warningThreshold: 0.5 },
  },
];

const getStatusColor = (value: number, metric: MetricConfig) => {
  const { min, max, warningThreshold } = metric.ranges;

  if (value < min || value > max) return "destructive";
  if (value < min + warningThreshold || value > max - warningThreshold)
    return "secondary";
  return "default";
};

const getStatusText = (value: number, metric: MetricConfig) => {
  const color = getStatusColor(value, metric);
  if (color === "destructive") return "Critical";
  if (color === "secondary") return "Warning";
  return "Normal";
};

export default function MonitoringPage() {
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const { data: sensorData, error, loading } = useSensorData(5000);

  useEffect(() => {
    if (sensorData) {
      setHistoricalData((prev) => {
        const newData = [
          ...prev,
          {
            time: new Date(sensorData.timestamp).toLocaleTimeString(),
            ...sensorData.sensors,
          },
        ];
        return newData.slice(-24);
      });
    }
  }, [sensorData]);

  const metrics = METRICS.map((metric) => ({
    ...metric,
    value:
      sensorData?.sensors[metric.type as keyof typeof sensorData.sensors] ??
      metric.value,
  }));

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Water Quality Monitoring</h1>
            <Button variant="outline" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Configure Alerts
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {metrics.map((metric) => (
              <Card
                key={metric.type}
                className={`relative overflow-hidden transition-opacity ${
                  loading ? "opacity-50" : ""
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.name}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">
                      {metric.value.toFixed(2)}
                      {metric.unit && ` ${metric.unit}`}
                    </div>
                    <Badge variant={getStatusColor(metric.value, metric)}>
                      {getStatusText(metric.value, metric)}
                    </Badge>
                  </div>
                  {historicalData.length > 1 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      {metric.value >
                      historicalData[historicalData.length - 2][metric.type] ? (
                        <ArrowUpCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span>from last reading</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Water Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        padding={{ left: 0, right: 0 }}
                        tick={{ fill: "hsl(var(--foreground))" }}
                        scale="auto"
                        tickLine
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--foreground))" }}
                        scale="auto"
                        tickLine
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      {(selectedMetric === "all" ||
                        selectedMetric === "ph") && (
                        <Line
                          type="monotone"
                          dataKey="ph"
                          stroke="hsl(var(--chart-1))"
                          name="pH"
                          strokeWidth={2}
                        />
                      )}
                      {(selectedMetric === "all" ||
                        selectedMetric === "ammonia") && (
                        <Line
                          type="monotone"
                          dataKey="ammonia"
                          stroke="hsl(var(--chart-2))"
                          name="Ammonia (mg/L)"
                          strokeWidth={2}
                        />
                      )}
                      {(selectedMetric === "all" ||
                        selectedMetric === "salinity") && (
                        <Line
                          type="monotone"
                          dataKey="salinity"
                          stroke="hsl(var(--chart-3))"
                          name="Salinity (ppt)"
                          strokeWidth={2}
                        />
                      )}
                      {(selectedMetric === "all" ||
                        selectedMetric === "oxygen") && (
                        <Line
                          type="monotone"
                          dataKey="oxygen"
                          stroke="hsl(var(--chart-4))"
                          name="Dissolved Oxygen (mg/L)"
                          strokeWidth={2}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant={selectedMetric === "all" ? "default" : "outline"}
                    onClick={() => setSelectedMetric("all")}
                    size="sm"
                  >
                    All Metrics
                  </Button>
                  {metrics.map((metric) => (
                    <Button
                      key={metric.type}
                      variant={
                        selectedMetric === metric.type ? "default" : "outline"
                      }
                      onClick={() => setSelectedMetric(metric.type)}
                      size="sm"
                    >
                      {metric.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.map((metric) => {
                  const status = getStatusColor(metric.value, metric);
                  if (status !== "destructive") return null;

                  return (
                    <Alert key={metric.type} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{`${metric.name} Alert`}</AlertTitle>
                      <AlertDescription>
                        {`Current value: ${metric.value.toFixed(2)}${
                          metric.unit || ""
                        } (Range: ${metric.ranges.min}-${metric.ranges.max}${
                          metric.unit || ""
                        })`}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full mt-2"
                        >
                          Take Action
                        </Button>
                      </AlertDescription>
                    </Alert>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
