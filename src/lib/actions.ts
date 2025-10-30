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
    answeredQuestions: { qId: number, answer: number | null }[];
    timestamp: string;
}

export type ExamResult = {
    user_id: string;
    name: string;
    enrollment_id: string;
    score: number;
    correct_answers: number;
    incorrect_answers: number;
    answers: { qId: number, answer: number | null }[];
    created_at: string;
};


export async function saveUserAndResult(data: { user: User, result: Result }) {
  // Si el cliente de Supabase no está configurado, no hacer nada.
  if (!supabase) {
    console.warn("Supabase client is not configured. Skipping saveUserAndResult.");
    return { success: false, message: "Supabase is not configured." };
  }

  try {
    const { user, result } = data;
    // Usa upsert para insertar o actualizar si el user_id ya existe.
    const { error } = await supabase
      .from('exam_results')
      .upsert({ 
        user_id: user.id,
        name: user.name,
        enrollment_id: user.enrollmentId,
        score: result.score,
        correct_answers: result.correctAnswers,
        incorrect_answers: result.incorrectAnswers,
        answers: result.answeredQuestions,
        created_at: result.timestamp
       }, {
        onConflict: 'user_id' // Especifica la columna para resolver conflictos
       });

    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/admin/students");
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
    const recordsToUpsert = data.results.map(result => {
        const user = data.users.find(u => u.id === result.userId);
        if (user) {
            return {
                user_id: user.id,
                name: user.name,
                enrollment_id: user.enrollmentId,
                score: result.score,
                correct_answers: result.correctAnswers,
                incorrect_answers: result.incorrectAnswers,
                answers: result.answeredQuestions,
                created_at: result.timestamp,
            };
        }
        return null;
    }).filter((r): r is NonNullable<typeof r> => r !== null);


    if (recordsToUpsert.length > 0) {
        // Usa upsert para insertar o actualizar registros en conflicto (basado en user_id).
        const { error } = await supabase.from('exam_results').upsert(recordsToUpsert, {
            onConflict: 'user_id'
        });
        if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/admin/students");
    return { success: true, message: "Offline data synced successfully." };
  } catch (error: any) {
    console.error("Error syncing offline data to Supabase:", error);
    return { success: false, message: error.message || "Failed to sync offline data." };
  }
}

export async function searchResultsByEnrollmentId(enrollmentId: string) {
    if (!supabase) {
        return { success: false, message: "Supabase is not configured.", data: null };
    }
    if (!enrollmentId) {
        return { success: true, message: "Enter an ID to search.", data: [] };
    }

    try {
        const { data, error } = await supabase
            .from('exam_results')
            .select('*')
            .ilike('enrollment_id', `%${enrollmentId}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error("Error searching results:", error);
        return { success: false, message: error.message, data: null };
    }
}

export async function getAllResults() {
    if (!supabase) {
        return { success: false, message: "Supabase is not configured.", data: null };
    }

    try {
        const { data, error } = await supabase
            .from('exam_results')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data: data as ExamResult[] };
    } catch (error: any) {
        console.error("Error fetching all results:", error);
        return { success: false, message: error.message, data: null };
    }
}


export async function updateResult(userId: string, data: Partial<Pick<ExamResult, 'name' | 'enrollment_id'>>) {
    if (!supabase) {
        return { success: false, message: "Supabase is not configured." };
    }

    try {
        const { error } = await supabase
            .from('exam_results')
            .update({ name: data.name, enrollment_id: data.enrollment_id })
            .eq('user_id', userId);

        if (error) throw error;
        revalidatePath('/admin/students');
        return { success: true, message: "Registro actualizado exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}


export async function deleteResult(userId: string) {
    if (!supabase) {
        return { success: false, message: "Supabase is not configured." };
    }
    try {
        const { error } = await supabase
            .from('exam_results')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        revalidatePath('/admin/students');
        return { success: true, message: "Registro eliminado." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function checkIfResultExists(enrollmentId: string) {
    if (!supabase) {
        return { exists: false, message: "Supabase is not configured." };
    }
    try {
        const { data, error } = await supabase
            .from('exam_results')
            .select('user_id')
            .eq('enrollment_id', enrollmentId)
            .limit(1);

        if (error) throw error;

        return { exists: data.length > 0 };
    } catch (error: any) {
        console.error("Error checking if result exists:", error);
        return { exists: false, message: error.message };
    }
}
