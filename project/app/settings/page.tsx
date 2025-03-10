"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Shield, Sliders } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Button>Save Changes</Button>
          </div>

          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2">
                <Sliders className="h-4 w-4" />
                Alert Thresholds
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails for critical water quality issues
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daily Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Get daily summary of farm metrics
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Thresholds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>pH Level Warning Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="number" placeholder="Min (6.5)" />
                        <Input type="number" placeholder="Max (8.5)" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Dissolved Oxygen Warning (mg/L)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="number" placeholder="Min (4.0)" />
                        <Input type="number" placeholder="Max (9.0)" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Temperature Warning Range (°C)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="number" placeholder="Min (25)" />
                        <Input type="number" placeholder="Max (32)" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                  <Button className="w-full">Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
