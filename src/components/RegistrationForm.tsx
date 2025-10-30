"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { addUser } from "@/lib/indexedDB";
import { checkIfResultExists } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Play } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  enrollmentId: z.string().min(4, "El ID de inscripción debe tener al menos 4 caracteres."),
});

export function RegistrationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      enrollmentId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors(); // Limpiar errores previos

    if (isOnline) {
      // Verificar si el resultado ya existe solo si estamos en línea
      const { exists, message } = await checkIfResultExists(values.enrollmentId);
      if (exists) {
        toast({
          title: "Error de Registro",
          description: "Este alumno ya ha realizado el examen.",
          variant: "destructive",
        });
        form.setError("enrollmentId", { type: "manual", message: "Este ID ya ha sido utilizado." });
        return; // Detener el proceso
      }
      if (message && !exists) { // Si hubo un error en la verificación
        toast({
            title: "Error de Verificación",
            description: message,
            variant: "destructive",
        });
        return;
      }
    }

    const user = { ...values, id: uuidv4() };
    
    // Si estamos sin conexión, simplemente guardamos localmente y procedemos
    if (!isOnline) {
      try {
        await addUser(user);
        toast({
          title: "Estás sin conexión",
          description: "Tu registro se ha guardado localmente y se sincronizará cuando vuelvas a tener conexión.",
        });
        localStorage.setItem('currentUser', JSON.stringify(user));
        router.push('/exam');
      } catch (error) {
        console.error("Failed to save user to IndexedDB", error);
        toast({
          title: "Error",
          description: "No se pudo guardar tu registro localmente.",
          variant: "destructive",
        });
      }
    } else {
        // Si estamos en línea y la verificación pasó, procedemos.
        localStorage.setItem('currentUser', JSON.stringify(user));
        router.push('/exam');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enrollmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de Inscripción</FormLabel>
              <FormControl>
                <Input placeholder="ej., A00123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Comenzar Examen
        </Button>
      </form>
    </Form>
  );
}
