"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { addUser, addResult } from "@/lib/indexedDB";

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
  name: z.string().min(2, "Name must be at least 2 characters."),
  enrollmentId: z.string().min(4, "Enrollment ID must be at least 4 characters."),
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
    const user = { ...values, id: uuidv4() };

    if (!isOnline) {
      try {
        await addUser(user);
        toast({
          title: "You are offline",
          description: "Your registration is saved locally and will sync when you're back online.",
        });
        // Since we are offline, we can't save to a shared state, so we pass via localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        router.push('/exam');
      } catch (error) {
        console.error("Failed to save user to IndexedDB", error);
        toast({
          title: "Error",
          description: "Could not save your registration locally.",
          variant: "destructive",
        });
      }
    } else {
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <FormLabel>Enrollment ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., A00123456" {...field} />
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
          Start Exam
        </Button>
      </form>
    </Form>
  );
}
