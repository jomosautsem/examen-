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
      if (isOnline && !isSyncing) {
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
              window.dispatchEvent(new CustomEvent('datasync'));
              toast({
                title: "¡Sincronización Completa!",
                description: "Tus datos sin conexión han sido guardados exitosamente.",
              });
            } else {
              throw new Error(response.message || 'Sync failed');
            }
          }
        } catch (error) {
          console.error('Sync failed:', error);
          toast({
            title: "Fallo en la Sincronización",
            description: "No se pudieron sincronizar tus datos. Se reintentará más tarde.",
            variant: "destructive",
          });
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncData();
  }, [isOnline, toast, isSyncing]);

  return null;
}
