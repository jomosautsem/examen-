import { Suspense } from 'react';
import { StudentsClient } from './StudentsClient';
import { getAllResults } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

function StudentsLoading() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    )
}

export default async function AdminStudentsPage() {
  const { data: results, message } = await getAllResults();

  if (!results) {
      return <div>Error: {message}</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Suspense fallback={<StudentsLoading />}>
        <StudentsClient results={results} />
      </Suspense>
    </div>
  );
}
