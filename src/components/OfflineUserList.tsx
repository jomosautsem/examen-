"use client";

import { useEffect, useState } from "react";
import { getOfflineUsers } from "@/lib/indexedDB";
import { User, List } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface OfflineUser {
  id: string;
  name: string;
  enrollmentId: string;
}

export function OfflineUserList() {
  const [users, setUsers] = useState<OfflineUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const offlineUsers = await getOfflineUsers();
      setUsers(offlineUsers);
    } catch (error) {
      console.error("Failed to fetch offline users:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const handleDataSync = () => {
      fetchUsers();
    };
    
    window.addEventListener('datasync', handleDataSync);

    return () => {
      window.removeEventListener('datasync', handleDataSync);
    };
  }, []);

  if (loading) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
        </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center">
        <List className="w-12 h-12 mb-4 text-primary" />
        <p className="font-semibold">No hay registros pendientes.</p>
        <p className="text-sm">Todos los datos sin conexión han sido sincronizados.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {users.map((user, index) => (
        <li key={`${user.id}-${index}`} className="flex items-center gap-4 p-3 bg-background rounded-md border">
          <div className="bg-primary/20 p-2 rounded-full">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">Matrícula: {user.enrollmentId}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
