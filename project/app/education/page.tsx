'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, CheckCircle2, Bug, Bell } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/sidebar';

interface Disease {
  name: string;
  virus: string;
  description: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  image: string;
}

const diseases: Disease[] = [
  {
    name: "Black Gill Disease",
    virus: "Black Gill Virus (BGV)",
    description: "A condition where the shrimp's gills turn black or dark brown, affecting their ability to breathe properly.",
    symptoms: [
      "Black or dark-colored gills",
      "Reduced movement and slow growth",
      "Weak and lethargic shrimp"
    ],
    causes: [
      "Black Gill Virus (BGV)",
      "Poor water quality (low oxygen, high ammonia)",
      "Fungal and bacterial infections"
    ],
    prevention: [
      "Improve water quality – Ensure proper aeration",
      "Use healthy seeds – Buy disease-free shrimp larvae",
      "Disinfect the pond – Use lime or probiotics",
      "Reduce stress – Avoid overcrowding"
    ],
    image: "https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Yellow Head Disease",
    virus: "Red Head Virus (RHV)",
    description: "A deadly viral infection that spreads quickly in shrimp farms, causing the shrimp's head to turn yellow and leading to sudden mass deaths.",
    symptoms: [
      "Yellowish or pale head and body",
      "Shrimp stop eating and become weak",
      "High mortality within a few days"
    ],
    causes: [
      "Red Head Virus (RHV), a waterborne virus",
      "Contaminated water from infected farms",
      "Poor biosecurity measures"
    ],
    prevention: [
      "Maintain strict biosecurity",
      "Use pathogen-free seeds",
      "Isolate infected shrimp immediately",
      "Monitor early symptoms"
    ],
    image: "https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "White Spot Disease",
    virus: "White Spot Syndrome Virus (WSSV)",
    description: "One of the most dangerous viral infections in shrimp farming. It spreads rapidly and has no cure.",
    symptoms: [
      "White spots on the shell and body",
      "Shrimp become slow and weak",
      "Mass death within a few days"
    ],
    causes: [
      "White Spot Syndrome Virus (WSSV)",
      "Contaminated water, feed, or equipment",
      "Sudden changes in water temperature or quality"
    ],
    prevention: [
      "Strong biosecurity practices",
      "Disinfect water & ponds",
      "Avoid wild shrimp & contaminated feed",
      "Monitor water conditions"
    ],
    image: "https://images.unsplash.com/photo-1574113715734-e538bd5bc985?auto=format&fit=crop&w=800&q=80"
  }
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "Which virus causes black or dark-colored gills in shrimp?",
    options: ["Red Head Virus", "Black Gill Virus", "White Spot Syndrome Virus", "Yellow Head Virus"],
    correctAnswer: 1
  },
  {
    question: "What is a common symptom of Yellow Head Disease?",
    options: ["White spots on shell", "Black gills", "Yellowish head and body", "Red spots"],
    correctAnswer: 2
  },
  {
    question: "Which disease has no known cure and spreads rapidly?",
    options: ["Black Gill Disease", "Yellow Head Disease", "White Spot Disease", "All of the above"],
    correctAnswer: 2
  }
];

export default function EducationPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnswer = useCallback((selectedAnswer: number) => {
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setProgress((nextQuestion / quizQuestions.length) * 100);
    } else {
      setShowResults(true);
      setProgress(100);
    }
  }, [currentQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setProgress(0);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BookOpen className="h-8 w-8 text-cyan-300" />
          <h1 className="text-3xl font-bold text-white">Education Center</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-cyan-300" />
          <span className="text-cyan-300 font-semibold">Live Alerts</span>
        </div>
      </div>

      {/* Removed supabase alerts section */}

      <Tabs defaultValue="learn" className="space-y-6">
        <TabsList className="bg-white/10 border-none">
          <TabsTrigger value="learn" className="text-white data-[state=active]:bg-white/20">
            Learn
          </TabsTrigger>
          <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-white/20">
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="space-y-6">
          {diseases.map((disease, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-lg border-none text-white p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Bug className="h-6 w-6 text-cyan-300" />
                  <h2 className="text-xl font-semibold">{disease.name}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-cyan-300 font-semibold">{disease.virus}</p>
                    <p className="text-gray-300 mt-2">{disease.description}</p>
                    
                    <div className="mt-4">
                      <img
                        src={disease.image}
                        alt={disease.name}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-cyan-300">Symptoms</h3>
                      <ul className="space-y-1 mt-2">
                        {disease.symptoms.map((symptom, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-cyan-300">Causes</h3>
                      <ul className="space-y-1 mt-2">
                        {disease.causes.map((cause, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <Bug className="h-4 w-4 text-red-400" />
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-cyan-300">Prevention</h3>
                      <ul className="space-y-1 mt-2">
                        {disease.prevention.map((prevention, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span>{prevention}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-none text-white p-6">
            <div className="space-y-4">
              <Progress value={progress} className="w-full h-2" />
              
              {!showResults ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </h3>
                  <p className="text-lg">{quizQuestions[currentQuestion].question}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start hover:bg-white/20"
                        onClick={() => handleAnswer(index)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                  <p className="text-xl">
                    You scored {score} out of {quizQuestions.length}
                  </p>
                  <Button onClick={resetQuiz} className="bg-cyan-500 hover:bg-cyan-600">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}