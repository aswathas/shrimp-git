"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Droplet,
  Info,
  LifeBuoy,
  Thermometer,
  TestTube2,
  Fish,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Section {
  title: string;
  content: string;
  icon: JSX.Element;
  subsections?: { title: string; content: string }[];
}

const sections: Section[] = [
  {
    title: "Optimal Water Quality",
    content:
      "Water quality is the foundation of prawn health. Key parameters like pH (7.5-8.5), temperature (26-30°C), and dissolved oxygen (>5 mg/L) should be maintained. Regular water exchange and aeration improve shrimp survival rates.",
    icon: <Droplet className="h-6 w-6 text-cyan-300" />,
    subsections: [
      {
        title: "pH Levels",
        content:
          "Maintaining the correct pH level is crucial for prawn health. The ideal pH range is between 7.5 and 8.5. Regular monitoring and adjustments using lime or other pH stabilizers can help maintain this balance.",
      },
      {
        title: "Temperature Control",
        content:
          "Prawns thrive in water temperatures between 26°C and 30°C. Sudden temperature fluctuations can stress the prawns, making them more susceptible to diseases. Use heaters or coolers as needed to maintain a stable temperature.",
      },
      {
        title: "Dissolved Oxygen",
        content:
          "Dissolved oxygen levels should be kept above 5 mg/L. Aeration systems, such as air pumps and diffusers, can help maintain adequate oxygen levels, especially in densely stocked ponds.",
      },
    ],
  },
  {
    title: "Proper Nutrition",
    content:
      "A balanced diet ensures prawns grow efficiently. Feed should contain 35-40% protein, vitamins, minerals, and probiotics for immunity. Avoid overfeeding and use floating pellets to monitor consumption.",
    icon: <CheckCircle2 className="h-6 w-6 text-green-400" />,
    subsections: [
      {
        title: "Protein Requirements",
        content:
          "Prawns require a diet high in protein, typically between 35-40%. High-quality feed with a balanced amino acid profile is essential for optimal growth and development.",
      },
      {
        title: "Vitamins and Minerals",
        content:
          "Vitamins and minerals play a crucial role in prawn health. Ensure the feed contains adequate levels of vitamins A, D, E, and K, as well as essential minerals like calcium and phosphorus.",
      },
      {
        title: "Feeding Practices",
        content:
          "Feed prawns 2-3 times a day, ensuring that the feed is consumed within 2 hours. Overfeeding can lead to water quality issues, while underfeeding can stunt growth.",
      },
    ],
  },
  {
    title: "Common Diseases & Prevention",
    content:
      "Diseases like White Spot Disease, Black Gill, and Yellow Head Disease spread quickly. Maintaining strict biosecurity, using disease-free larvae, and disinfecting water sources can prevent outbreaks.",
    icon: <AlertTriangle className="h-6 w-6 text-yellow-400" />,
    subsections: [
      {
        title: "White Spot Disease",
        content:
          "White Spot Disease is caused by a virus and is highly contagious. Symptoms include white spots on the shell and lethargy. Immediate isolation of infected prawns and disinfection of the pond are necessary.",
      },
      {
        title: "Black Gill Disease",
        content:
          "Black Gill Disease is caused by a fungus and can lead to respiratory distress. Regular water quality management and the use of antifungal treatments can help prevent this disease.",
      },
      {
        title: "Yellow Head Disease",
        content:
          "Yellow Head Disease is caused by a virus and can lead to high mortality rates. Infected prawns exhibit yellowing of the head and gills. Strict biosecurity measures are essential to prevent outbreaks.",
      },
    ],
  },
  {
    title: "Biosecurity & Disease Control",
    content:
      "Limit external contamination by disinfecting equipment and ponds. Quarantine new shrimp before adding them to the main pond. Use probiotics and herbal extracts to enhance immunity naturally.",
    icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
    subsections: [
      {
        title: "Quarantine Procedures",
        content:
          "New prawns should be quarantined for at least 14 days before introducing them to the main pond. This helps to identify and treat any potential diseases before they spread.",
      },
      {
        title: "Disinfection Protocols",
        content:
          "Regularly disinfect all equipment, nets, and containers used in the pond. Use approved disinfectants and follow the manufacturer's instructions for effective results.",
      },
      {
        title: "Probiotics and Herbal Extracts",
        content:
          "Probiotics and herbal extracts can enhance the natural immunity of prawns. Add these supplements to the feed or water to promote a healthy gut microbiome and reduce disease incidence.",
      },
    ],
  },
];

export default function PrawnHealthPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BookOpen className="h-8 w-8 text-cyan-300" />
          <h1 className="text-3xl font-bold text-white">
            Prawn Health & Disease Awareness
          </h1>
        </div>
      </div>

      {/* Tabs for better navigation */}
      <Tabs defaultValue="learn" className="space-y-6">
        <TabsList className="bg-white/10 border-none">
          <TabsTrigger
            value="learn"
            className="text-white data-[state=active]:bg-white/20"
          >
            Learn
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="text-white data-[state=active]:bg-white/20"
          >
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="text-white data-[state=active]:bg-white/20"
          >
            Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="space-y-6">
          {sections.map((section, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-lg border-none text-white p-6"
            >
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <Button variant="outline" className="text-white">
                    {activeIndex === index ? "Hide" : "Read More"}
                  </Button>
                </div>

                {activeIndex === index && (
                  <div className="space-y-4">
                    <p className="text-gray-300">{section.content}</p>
                    {section.subsections && (
                      <div className="space-y-4">
                        {section.subsections.map((subsection, subIndex) => (
                          <div
                            key={subIndex}
                            className="pl-6 border-l-2 border-cyan-300"
                          >
                            <h3 className="text-lg font-semibold text-cyan-300">
                              {subsection.title}
                            </h3>
                            <p className="text-gray-300">
                              {subsection.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-none text-white p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Info className="h-6 w-6 text-cyan-300" />
                <h2 className="text-xl font-semibold">Additional Resources</h2>
              </div>
              <p className="text-gray-300">
                Here are some additional resources to help you manage prawn
                health and disease:
              </p>
              <ul className="list-disc list-inside text-gray-300">
                <li>Prawn Health Management Guide</li>
                <li>Water Quality Testing Kits</li>
                <li>Disease Identification Charts</li>
                <li>Probiotic and Herbal Extract Suppliers</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-none text-white p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <LifeBuoy className="h-6 w-6 text-cyan-300" />
                <h2 className="text-xl font-semibold">Tools & Calculators</h2>
              </div>
              <p className="text-gray-300">
                Use these tools to help manage your prawn farming operations:
              </p>
              <ul className="list-disc list-inside text-gray-300">
                <li>Water Quality Calculator</li>
                <li>Feed Conversion Ratio (FCR) Calculator</li>
                <li>Disease Risk Assessment Tool</li>
                <li>Stocking Density Calculator</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
