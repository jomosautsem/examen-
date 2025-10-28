import Image from "next/image";
import { BookOpenCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RegistrationForm } from "@/components/RegistrationForm";
import { OfflineUserList } from "@/components/OfflineUserList";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-12">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground font-semibold py-1 px-3 rounded-full mb-4">
            <BookOpenCheck className="w-5 h-5" />
            PWA Exam
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground">
            Test Your PWA Knowledge
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Take our 10-question multiple-choice exam to see how much you know about Progressive Web Apps. Works online and offline!
          </p>
        </div>
        {heroImage && (
          <div className="w-full max-w-lg">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Start the Exam</CardTitle>
            <CardDescription>Enter your details below to begin.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Users />
              Pending Registrations
            </CardTitle>
            <CardDescription>Users who registered offline. They will be synced to the database when you're back online.</CardDescription>
          </CardHeader>
          <CardContent>
            <OfflineUserList />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
