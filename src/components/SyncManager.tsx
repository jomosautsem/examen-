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
        return; // No hay nada que sincronizar
      }
      
      setIsSyncing(true);
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
        console.error('Sync failed:', response?.message);
        toast({
          title: "Fallo en la Sincronización",
          description: response?.message || "No se pudieron sincronizar tus datos. Revisa tu conexión o inténtalo más tarde.",
          variant: "destructive",
        });
      }
      
      setIsSyncing(false);
    };

    if (isOnline) {
      syncData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return null;
}
