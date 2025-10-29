"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { searchResultsByEnrollmentId } from '@/lib/actions';
import { questions as allQuestions } from '@/lib/questions';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Search, User, FileText, BarChart, Check, X, Calendar, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ReviewCard } from '../results/ReviewCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const formSchema = z.object({
  enrollmentId: z.string().min(1, "Debes ingresar un ID de inscripción."),
});

type SearchResult = {
    user_id: string;
    name: string;
    enrollment_id: string;
    score: number;
    correct_answers: number;
    incorrect_answers: number;
    answers: { qId: number, answer: number | null }[];
    created_at: string;
};

export function SearchClient() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { enrollmentId: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setResults([]);
    const response = await searchResultsByEnrollmentId(values.enrollmentId);
    if (response.success && response.data) {
      setResults(response.data);
      if (response.data.length === 0) {
        toast({ title: "Sin Resultados", description: "No se encontraron exámenes para ese ID." });
      }
    } else {
      toast({ title: "Error en la Búsqueda", description: response.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline text-3xl">Buscar Resultados de Examen</CardTitle>
            <CardDescription>Ingresa el ID de inscripción para encontrar los resultados del examen de un usuario.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Menú Principal
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="enrollmentId"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="Ej. A00123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
                <span className="ml-2 hidden md:inline">Buscar</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-6">
            <h2 className='font-headline text-2xl'>Resultados para "{form.getValues('enrollmentId')}"</h2>
          {results.map((result) => (
            <Card key={result.user_id} className="shadow-md">
              <CardHeader>
                <CardTitle className='flex items-center gap-2'><User /> {result.name}</CardTitle>
                <CardDescription>ID: {result.enrollment_id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-6">
                    <div className="p-4 bg-muted rounded-lg">
                        <BarChart className="mx-auto mb-2 h-8 w-8 text-primary" />
                        <p className="text-3xl font-bold">{result.score.toFixed(0)}%</p>
                        <p className="text-sm text-muted-foreground">Puntuación</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <Check className="mx-auto mb-2 h-8 w-8 text-green-500" />
                        <p className="text-3xl font-bold">{result.correct_answers}</p>
                        <p className="text-sm text-muted-foreground">Correctas</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <X className="mx-auto mb-2 h-8 w-8 text-destructive" />
                        <p className="text-3xl font-bold">{result.incorrect_answers}</p>
                        <p className="text-sm text-muted-foreground">Incorrectas</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <Calendar className="mx-auto mb-2 h-8 w-8 text-foreground" />
                        <p className="text-lg font-bold">{format(new Date(result.created_at), "dd MMMM yyyy", { locale: es })}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(result.created_at), "p", { locale: es })}</p>
                    </div>
                </div>
                
                <Separator className='my-6' />

                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <FileText /> Ver Revisión Detallada del Examen
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      {result.answers.map(({ qId, answer }) => {
                        const question = allQuestions.find(q => q.id === qId);
                        if (!question) return null;
                        return (
                          <ReviewCard
                            key={qId}
                            question={question}
                            userAnswer={answer}
                          />
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
