"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Home, User, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { ExamResult } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { updateResult, deleteResult } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type StudentsClientProps = {
  results: ExamResult[];
};

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  enrollment_id: z.string().min(4, "La matrícula debe tener al menos 4 caracteres."),
});

export function StudentsClient({ results: initialResults }: StudentsClientProps) {
  const [results, setResults] = useState<ExamResult[]>(initialResults);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [resultToDelete, setResultToDelete] = useState<ExamResult | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      enrollment_id: "",
    },
  });

  const handleEdit = (result: ExamResult) => {
    setSelectedResult(result);
    form.reset({
        name: result.name,
        enrollment_id: result.enrollment_id,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (result: ExamResult) => {
    setResultToDelete(result);
  };

  const confirmDelete = async () => {
    if (!resultToDelete) return;

    const response = await deleteResult(resultToDelete.user_id);
    if (response.success) {
      setResults(results.filter(r => r.user_id !== resultToDelete.user_id));
      toast({ title: 'Éxito', description: 'Registro eliminado correctamente.' });
    } else {
      toast({ title: 'Error', description: response.message, variant: 'destructive' });
    }
    setResultToDelete(null);
  };

  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedResult) return;
    setIsSubmitting(true);

    const response = await updateResult(selectedResult.user_id, values);

    if (response.success) {
        setResults(results.map(r => r.user_id === selectedResult.user_id ? {...r, ...values} : r));
        toast({ title: 'Éxito', description: "Registro actualizado." });
        setIsEditModalOpen(false);
    } else {
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };


  return (
    <div className="w-full">
      <Card>
          <CardHeader className="flex flex-row items-start justify-between">
              <div>
                  <CardTitle className="font-headline text-3xl flex items-center gap-2"><User /> Administración de Alumnos</CardTitle>
                  <CardDescription>Ver, editar o eliminar los registros de los exámenes.</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Menú Principal
                </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Puntaje</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {results.map((result) => (
                    <TableRow key={result.user_id}>
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell>{result.enrollment_id}</TableCell>
                    <TableCell>{result.score.toFixed(0)}%</TableCell>
                    <TableCell>{format(new Date(result.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(result)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(result)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {results.length === 0 && <p className="text-center text-muted-foreground p-8">No se encontraron resultados.</p>}
          </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription>
              Modifica los datos del registro. Haz clic en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enrollment_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!resultToDelete} onOpenChange={() => setResultToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del examen de
              <span className="font-semibold"> {resultToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResultToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
