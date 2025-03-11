"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Droplet,
  ThermometerSun,
  Wind,
  FileText,
  Camera,
  Microscope,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const waterQualityData = [
  { time: "00:00", ph: 7.2, temperature: 26, oxygen: 6.5 },
  { time: "04:00", ph: 7.1, temperature: 25, oxygen: 6.2 },
  { time: "08:00", ph: 7.3, temperature: 27, oxygen: 6.8 },
  { time: "12:00", ph: 7.4, temperature: 28, oxygen: 7.0 },
  { time: "16:00", ph: 7.2, temperature: 27, oxygen: 6.7 },
  { time: "20:00", ph: 7.1, temperature: 26, oxygen: 6.4 },
];

const features = [
  {
    title: "Prawn Health Diagnosis",
    description:
      "Assess prawn health conditions through our interactive questionnaire. Answer simple yes/no questions to get started.",
    icon: <Check className="h-10 w-10 text-primary" />,
    link: "/diagnosis",
  },
  {
    title: "AI Image Analysis",
    description:
      "Upload images of your prawns for automated disease detection powered by advanced machine learning.",
    icon: <Camera className="h-10 w-10 text-primary" />,
    link: "/diagnosis",
  },
  {
    title: "IoT Water Monitoring",
    description:
      "Real-time monitoring of critical water parameters like pH, temperature, and TDS.",
    icon: <Droplet className="h-10 w-10 text-primary" />,
    link: "/monitoring",
  },
  {
    title: "Comprehensive Reports",
    description:
      "Generate detailed PDF reports with AI-powered analysis and specific treatment recommendations.",
    icon: <FileText className="h-10 w-10 text-primary" />,
    link: "/diagnosis",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="px-4 py-2" variant="outline">
                AI-Powered Solutions
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Advanced Prawn Health Management System
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Revolutionize your aquaculture practices with AI-driven disease
                detection, IoT water quality monitoring, and expert
                recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/diagnosis">
                  Start Diagnosis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/monitoring">View Monitoring Data</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-12 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Key Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400">
                Our comprehensive suite of tools helps you maintain optimal
                prawn health and maximize yield.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="p-2 w-fit rounded-full bg-primary/10 mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href={feature.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Live Monitoring Dashboard
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400">
                Preview of our real-time water quality monitoring system.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Water Temperature
                </CardTitle>
                <ThermometerSun className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">26.5°C</div>
                <p className="text-xs text-muted-foreground">
                  +0.2°C from last hour
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
                <div className="text-2xl font-bold">6.8 mg/L</div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 6-8 mg/L
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2</div>
                <p className="text-xs text-muted-foreground">
                  Within normal range
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Active notifications
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Water Quality Trends</CardTitle>
                <CardDescription>24-hour monitoring data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
                        stroke="hsl(var(--primary))"
                        name="pH"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#ff9800"
                        name="Temperature (°C)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="oxygen"
                        stroke="#03a9f4"
                        name="Dissolved Oxygen (mg/L)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-12 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400">
                Three simple steps to optimize your prawn cultivation
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-xl mb-4">
                  1
                </div>
                <CardTitle>Complete Questionnaire</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Answer 10 simple yes/no questions about your prawn's health,
                  feeding habits, and pond conditions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-xl mb-4">
                  2
                </div>
                <CardTitle>Upload Image (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Upload a clear image of your prawns for AI-powered disease
                  detection and analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-xl mb-4">
                  3
                </div>
                <CardTitle>Get Expert Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Receive a comprehensive PDF report with AI-generated analysis
                  and specific treatment recommendations.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button size="lg" asChild>
              <Link href="/diagnosis">
                Start Your Diagnosis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
