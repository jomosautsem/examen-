"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Award, RotateCw } from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { useEffect, useState } from 'react';

export function ResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const score = Number(searchParams.get('score') || 0);
  const correct = Number(searchParams.get('correct') || 0);
  const incorrect = Number(searchParams.get('incorrect') || 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: 'Correct', value: correct, fill: 'hsl(var(--chart-2))' },
    { name: 'Incorrect', value: incorrect, fill: 'hsl(var(--destructive))' },
  ];

  const getResultMessage = () => {
    if (score >= 90) return { title: "Excellent!", description: "You're a PWA expert!", icon: <Award className="h-12 w-12 text-primary" /> };
    if (score >= 70) return { title: "Great Job!", description: "You have a solid understanding of PWAs.", icon: <Award className="h-12 w-12 text-foreground" /> };
    if (score >= 50) return { title: "Good Effort!", description: "You're on your way to mastering PWAs.", icon: <RotateCw className="h-12 w-12 text-muted-foreground" /> };
    return { title: "Keep Studying!", description: "Review the material and try again.", icon: <RotateCw className="h-12 w-12 text-destructive" /> };
  };

  const { title, description, icon } = getResultMessage();

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in-slide-up">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">{icon}</div>
          <CardTitle className="font-headline text-4xl">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-8">
            <p className="text-6xl font-bold text-primary">{score.toFixed(0)}%</p>
            <p className="text-muted-foreground">Your Final Score</p>
          </div>
          
          <div className="h-[200px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent indicator="dot" hideLabel />}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-around text-center mb-8">
            <div className="flex items-center gap-2">
                <Check className="h-8 w-8 text-green-500" />
                <div>
                    <p className="text-2xl font-bold">{correct}</p>
                    <p className="text-muted-foreground">Correct</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <X className="h-8 w-8 text-destructive" />
                <div>
                    <p className="text-2xl font-bold">{incorrect}</p>
                    <p className="text-muted-foreground">Incorrect</p>
                </div>
            </div>
          </div>
          
          <Button className="w-full" size="lg" onClick={() => router.push('/')}>
            <RotateCw className="mr-2 h-4 w-4" />
            Take Another Exam
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
