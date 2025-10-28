import { Suspense } from 'react';
import { ResultsClient } from './ResultsClient';
import { Skeleton } from '@/components/ui/skeleton';

function ResultsLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Skeleton className="h-16 w-3/4 max-w-md mb-4" />
            <Skeleton className="h-8 w-1/2 max-w-sm mb-8" />
            <Skeleton className="h-[400px] w-full max-w-2xl rounded-lg" />
            <Skeleton className="h-12 w-48 mt-8 rounded-md" />
        </div>
    );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsClient />
    </Suspense>
  );
}
