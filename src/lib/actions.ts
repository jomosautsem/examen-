"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function saveUserAndResult(data: { user: { name: string; enrollmentId: string; id: string }, result: any }) {
  try {
    if (!db) {
      console.log("Firestore not initialized, skipping save.");
      return { success: true, message: "Firestore not initialized, skipped save.", data: null };
    }
    
    await addDoc(collection(db, "examResults"), {
      ...data.user,
      ...data.result,
      createdAt: serverTimestamp(),
    });
    
    revalidatePath("/");
    return { success: true, message: "Data saved successfully.", data: null };
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    return { success: false, message: "Failed to save data." };
  }
}

export async function syncOfflineData(data: { users: any[], results: any[] }) {
  if (!db) {
    console.log("Firestore not initialized, skipping sync.");
    return { success: true, message: "Firestore not initialized, sync skipped." };
  }

  try {
    const promises = data.results.map(result => {
      const user = data.users.find(u => u.id === result.userId);
      if (user) {
        return addDoc(collection(db, "examResults"), {
          name: user.name,
          enrollmentId: user.enrollmentId,
          score: result.score,
          correctAnswers: result.correctAnswers,
          incorrectAnswers: result.incorrectAnswers,
      		answers: result.answers,
          createdAt: new Date(result.timestamp),
        });
      }
      return Promise.resolve();
    });

    await Promise.all(promises);

    revalidatePath("/");
    return { success: true, message: "Offline data synced successfully." };
  } catch (error) {
    console.error("Error syncing offline data:", error);
    return { success: false, message: "Failed to sync offline data." };
  }
}
