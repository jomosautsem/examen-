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
              title: "Syncing data...",
              description: "Your offline data is being saved to the server.",
            });
            
            const response = await syncOfflineData({ users: usersToSync, results: resultsToSync });

            if (response.success) {
              await clearOfflineData();
              window.dispatchEvent(new CustomEvent('datasync'));
              toast({
                title: "Sync Complete!",
                description: "Your offline data has been successfully saved.",
              });
            } else {
              throw new Error(response.message || 'Sync failed');
            }
          }
        } catch (error) {
          console.error('Sync failed:', error);
          toast({
            title: "Sync Failed",
            description: "Could not sync your offline data. It will be retried later.",
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
