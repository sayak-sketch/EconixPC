import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <Leaf className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Econix Plantcare
          </h1>
        </div>
        <p className="mt-2 text-center text-lg text-muted-foreground">
          Your AI-powered assistant for a healthier garden.
        </p>
      </div>
    </header>
  );
}
