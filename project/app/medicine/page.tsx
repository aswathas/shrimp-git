"use client";

import { useState, FormEvent, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Search, Pill } from "lucide-react";

export default function MedicinePage() {
  // Create a state object to hold the yes/no values for 10 questions.
  // We'll use strings "true" or "false" (later converted to booleans).
  const [formState, setFormState] = useState({
    q1: "true",
    q2: "true",
    q3: "true",
    q4: "true",
    q5: "true",
    q6: "true",
    q7: "true",
    q8: "true",
    q9: "true",
    q10: "true",
  });
  const [prawnImage, setPrawnImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPrawnImage(e.target.files[0]);
    }
  };

interface SensorData {
  pH: number;
  tds: number;
  temperature: number;
}

const [sensorData, setSensorData] = useState<SensorData | null>(null);


  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/read_sensor");
        if (response.ok) {
          const data = await response.json();
          setSensorData(data);
        } else {
          console.error("Error fetching sensor data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    // Prepare FormData
    const data = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      data.append(key, value);
    });
    if(prawnImage) {
      data.append("prawn_image", prawnImage);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/diagnosis", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        // Get PDF blob and trigger download
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagnosis_report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Error:", await res.text());
      }
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-4">Medicine Management</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {sensorData && (
          <Card>
            <CardHeader>
              <CardTitle>Sensor Data</CardTitle>
            </CardHeader>
            <CardContent>
              {sensorData ? (
                <>
                  <p>pH: {sensorData.pH}</p>
                  <p>TDS: {sensorData.tds}</p>
                  <p>Temperature: {sensorData.temperature}°C</p>
                </>
              ) : (
                <p>Loading sensor data...</p>
              )}

            </CardContent>
          </Card>
        )}

        {/* Diagnosis Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Disease Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "q1", label: "1) Is the growth rate good?" },
                { name: "q2", label: "2) Is the food intake good?" },
                { name: "q3", label: "3) Are the weather conditions good?" },
                { name: "q4", label: "4) Is the pond affected by whitegutt previously?" },
                { name: "q5", label: "5) Is the plankton growth more or optimal?" },
                { name: "q6", label: "6) Are minerals provided 3-4 times every month?" },
                { name: "q7", label: "7) Is the estimated count matched with manual count?" },
                { name: "q8", label: "8) Are nearby ponds more affected by viruses?" },
                { name: "q9", label: "9) Are prawns losing shell at the correct time?" },
                { name: "q10", label: "10) Any shell loose cases in pond?" },
              ].map((q) => (
                <div key={q.name}>
                  <Label className="block mb-1 font-medium">{q.label}</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={q.name}
                        value="true"
                        checked={formState[q.name as keyof typeof formState] === "true"}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={q.name}
                        value="false"
                        checked={formState[q.name as keyof typeof formState] === "false"}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>
              ))}
              <div>
                <Label className="block mb-1 font-medium">Upload Prawn Image (optional)</Label>
                <Input type="file" onChange={handleFileChange} />
              </div>
              <Button type="submit" className="w-full">Submit Diagnosis</Button>
            </form>
          </CardContent>
        </Card>

        {/* Medicine Search Card (unchanged) */}
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
    </div>
  );
}
