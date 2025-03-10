"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, FileUp, Search } from "lucide-react";

export default function MedicinePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Medicine Management</h1>
            <Button className="gap-2">
              <Pill className="h-4 w-4" />
              Add Medicine
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Disease Detection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Images</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <FileUp className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop images here or click to upload
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </div>
                <Button className="w-full">Analyze Images</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medicine Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search medicines..." />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Oxytetracycline</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Broad-spectrum antibiotic for bacterial infections
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Dosage: 50mg/kg
                        </span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Formalin</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Treatment for external parasites and fungal infections
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Dosage: 15-25 ppm
                        </span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
