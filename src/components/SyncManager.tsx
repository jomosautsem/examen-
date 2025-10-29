"use client";

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getOfflineUsers, getOfflineResults, clearOfflineData } from '@/lib/indexedDB';
import { useToast } from '@/hooks/use-toast';
import { syncOfflineData } from '@/lib/actions';

export function SyncManager() {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncData = async () => {
      // Evita múltiples sincronizaciones simultáneas
      if (isSyncing) return;

      setIsSyncing(true);
      try {
        const usersToSync = await getOfflineUsers();
        const resultsToSync = await getOfflineResults();

        if (usersToSync.length > 0 || resultsToSync.length > 0) {
          toast({
            title: "Sincronizando datos...",
            description: "Tus datos sin conexión se están guardando en el servidor.",
          });
          
          const response = await syncOfflineData({ users: usersToSync, results: resultsToSync });

          if (response.success) {
            await clearOfflineData();
            // Dispara un evento para que otros componentes (como OfflineUserList) puedan actualizar su estado.
            window.dispatchEvent(new CustomEvent('datasync'));
            toast({
              title: "¡Sincronización Completa!",
              description: "Tus datos sin conexión han sido guardados exitosamente.",
            });
          } else {
            // Lanza un error para ser atrapado por el bloque catch
            throw new Error(response.message || 'La sincronización con el servidor falló.');
          }
        }
      } catch (error: any) {
        console.error('Sync failed:', error);
        toast({
          title: "Fallo en la Sincronización",
          description: error.message || "No se pudieron sincronizar tus datos. Se reintentará más tarde.",
          variant: "destructive",
        });
      } finally {
        setIsSyncing(false);
      }
    };

    // La sincronización solo se debe activar cuando el estado de conexión cambia a "en línea"
    if (isOnline) {
      syncData();
    }
  // Eliminamos 'isSyncing' de las dependencias para evitar el bucle infinito.
  // El efecto solo debe depender del estado de la conexión.
  }, [isOnline, toast]);

  return null;
}
