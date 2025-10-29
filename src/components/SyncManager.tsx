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
      if (!isOnline || isSyncing) {
        return;
      }

      const usersToSync = await getOfflineUsers();
      const resultsToSync = await getOfflineResults();

      if (usersToSync.length === 0 && resultsToSync.length === 0) {
        return;
      }
      
      setIsSyncing(true);
      
      try {
        toast({
          title: "Sincronizando datos...",
          description: "Tus datos sin conexión se están guardando en el servidor.",
        });
        
        const response = await syncOfflineData({ users: usersToSync, results: resultsToSync });

        if (response && response.success) {
          await clearOfflineData();
          window.dispatchEvent(new CustomEvent('datasync'));
          toast({
            title: "¡Sincronización Completa!",
            description: "Tus datos sin conexión han sido guardados exitosamente.",
          });
        } else {
          // Lanza un error para ser atrapado por el bloque catch con un mensaje claro
          throw new Error(response?.message || 'La sincronización con el servidor falló.');
        }
      } catch (error: any) {
        console.error('Sync failed:', error);
        toast({
          title: "Fallo en la Sincronización",
          description: "No se pudieron sincronizar tus datos. Revisa tu conexión o inténtalo más tarde.",
          variant: "destructive",
        });
      } finally {
        setIsSyncing(false);
      }
    };

    if (isOnline) {
      syncData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, toast]);

  return null;
}
