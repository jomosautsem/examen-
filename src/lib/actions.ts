"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface User {
    id: string;
    name: string;
    enrollmentId: string;
}

interface Result {
    userId: string;
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    answers: (number | null)[];
    timestamp: string;
}

export async function saveUserAndResult(data: { user: User, result: Result }) {
  // Si el cliente de Supabase no está configurado, no hacer nada.
  if (!supabase) {
    console.warn("Supabase client is not configured. Skipping saveUserAndResult.");
    return { success: false, message: "Supabase is not configured." };
  }

  try {
    const { user, result } = data;
    // Use upsert to prevent duplicate user entries and handle updates gracefully.
    // By omitting `onConflict`, Supabase will use the primary key of the table.
    const { error } = await supabase
      .from('exam_results')
      .upsert({ 
        user_id: user.id,
        name: user.name,
        enrollment_id: user.enrollmentId,
        score: result.score,
        correct_answers: result.correctAnswers,
        incorrect_answers: result.incorrectAnswers,
        answers: result.answers,
        created_at: result.timestamp
       });

    if (error) throw error;
    
    revalidatePath("/");
    return { success: true, message: "Data saved successfully.", data: null };
  } catch (error: any) {
    console.error("Error saving data to Supabase:", error);
    return { success: false, message: error.message || "Failed to save data." };
  }
}

export async function syncOfflineData(data: { users: User[], results: Result[] }) {
  // Si el cliente de Supabase no está configurado, no hacer nada.
  if (!supabase) {
    console.warn("Supabase client is not configured. Skipping syncOfflineData.");
    return { success: false, message: "Supabase is not configured." };
  }

  try {
    const recordsToInsert = data.results.map(result => {
        const user = data.users.find(u => u.id === result.userId);
        if (user) {
            return {
                user_id: user.id,
                name: user.name,
                enrollment_id: user.enrollmentId,
                score: result.score,
                correct_answers: result.correctAnswers,
                incorrect_answers: result.incorrectAnswers,
                answers: result.answers,
                created_at: result.timestamp,
            };
        }
        return null;
    }).filter(Boolean);

    if (recordsToInsert.length > 0) {
        // Use upsert here as well to prevent duplicates during sync.
        // By omitting `onConflict`, Supabase will use the primary key of the table.
        const { error } = await supabase.from('exam_results').upsert(recordsToInsert as any);
        if (error) throw error;
    }

    revalidatePath("/");
    return { success: true, message: "Offline data synced successfully." };
  } catch (error: any) {
    console.error("Error syncing offline data to Supabase:", error);
    return { success: false, message: error.message || "Failed to sync offline data." };
  }
}
