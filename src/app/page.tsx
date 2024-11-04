import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container p-2">
      <div className="text-3xl font-bold antialiased">
        Bienvenue sur AI-Recipes
      </div>

      <div className="h-screen flex items-center justify-center">
        <Button size={"lg"} className="w-72 h-14 text-xl">
          Nouvelle recette
        </Button>
      </div>
    </main>
  );
}
