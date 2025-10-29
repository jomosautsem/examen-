import Image from "next/image";
import { BookOpenCheck, Users, Search } from "lucide-react";
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RegistrationForm } from "@/components/RegistrationForm";
import { OfflineUserList } from "@/components/OfflineUserList";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-12">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground font-semibold py-1 px-3 rounded-full mb-4">
            <BookOpenCheck className="w-5 h-5" />
            Examen PWA
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground">
            Pon a Prueba tu Conocimiento de PWA
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Realiza nuestro examen de 10 preguntas de opción múltiple para ver cuánto sabes sobre Progressive Web Apps. ¡Funciona con y sin conexión!
          </p>
        </div>
        {heroImage && (
          <div className="w-full max-w-lg">
            <Image
              src={heroImage.imageUrl}
              alt="A person writing in a book with a feather pen at a desk."
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              data-ai-hint="writer desk"
              priority
            />
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Comenzar el Examen</CardTitle>
            <CardDescription>Ingresa tus datos a continuación para comenzar.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
          </CardContent>
        </Card>

        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Users />
              Registros Pendientes
            </CardTitle>
            <CardDescription>Usuarios que se registraron sin conexión. Se sincronizarán cuando estés en línea.</CardDescription>
          </CardHeader>
          <CardContent>
            <OfflineUserList />
          </CardContent>
        </Card>

        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Search />
              Buscar Resultados
            </CardTitle>
            <CardDescription>Busca y revisa los resultados de los exámenes de usuarios registrados en la base de datos.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-8">
            <Button asChild size="lg">
              <Link href="/search">Ir a la Búsqueda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
